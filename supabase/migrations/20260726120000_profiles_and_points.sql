create extension if not exists citext with schema extensions;

create table if not exists public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    nick text not null,
    avatar text not null default 'batman',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles
    drop constraint if exists profiles_nick_key,
    drop constraint if exists profiles_nick_unique;

alter table public.profiles
    alter column nick type extensions.citext using nick::extensions.citext,
    alter column avatar set default 'batman',
    alter column created_at set default now(),
    alter column updated_at set default now();

update public.profiles
set
    created_at = coalesce(created_at, now()),
    updated_at = coalesce(updated_at, now());

alter table public.profiles
    alter column created_at set not null,
    alter column updated_at set not null,
    add constraint profiles_nick_unique unique (nick),
    add constraint profiles_nick_format check (nick::text ~ '^[A-Za-z][A-Za-z0-9]{2,14}$'),
    add constraint profiles_avatar_valid check (
        avatar in (
            'batman',
            'superman',
            'wonder-woman',
            'the-flash',
            'green-lantern',
            'supergirl',
            'cyborg',
            'catwoman'
        )
    );

create table public.game_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    game_id text not null,
    rules_version smallint not null default 1,
    mode text not null default 'default',
    outcome text not null,
    score integer not null,
    duration_ms integer,
    metadata jsonb not null default '{}'::jsonb,
    idempotency_key uuid not null,
    points_awarded integer not null,
    is_personal_best boolean not null,
    created_at timestamptz not null default now(),
    constraint game_sessions_game_valid check (
        game_id in ('memory', 'twodots', 'hexapawn', 'hangman')
    ),
    constraint game_sessions_outcome_valid check (
        outcome in ('won', 'lost', 'completed')
    ),
    constraint game_sessions_rules_version_valid check (rules_version > 0),
    constraint game_sessions_score_valid check (score >= 0),
    constraint game_sessions_duration_valid check (
        duration_ms is null or duration_ms between 0 and 86400000
    ),
    constraint game_sessions_metadata_object check (jsonb_typeof(metadata) = 'object'),
    constraint game_sessions_points_valid check (points_awarded between 0 and 500),
    constraint game_sessions_idempotent unique (user_id, idempotency_key)
);

create table public.point_ledger (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    game_session_id uuid not null unique references public.game_sessions(id) on delete cascade,
    amount integer not null,
    reason text not null default 'game_completed',
    created_at timestamptz not null default now(),
    constraint point_ledger_amount_valid check (amount between 0 and 500)
);

create index game_sessions_user_created_idx
    on public.game_sessions (user_id, created_at desc);
create index game_sessions_user_best_idx
    on public.game_sessions (user_id, game_id, mode, rules_version, score desc);
create index point_ledger_user_created_idx
    on public.point_ledger (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    requested_nick text;
    requested_avatar text;
begin
    requested_nick := new.raw_user_meta_data ->> 'nick';
    requested_avatar := coalesce(new.raw_user_meta_data ->> 'avatar', 'batman');

    insert into public.profiles (user_id, nick, avatar)
    values (new.id, requested_nick, requested_avatar);

    return new;
exception
    when unique_violation then
        raise exception using
            errcode = '23505',
            message = 'Nickname is already in use';
    when check_violation then
        raise exception using
            errcode = '23514',
            message = 'Invalid nickname or avatar';
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.calculate_game_points(
    requested_game_id text,
    requested_outcome text,
    requested_score integer,
    requested_metadata jsonb
)
returns integer
language sql
immutable
set search_path = ''
as $$
    select case requested_game_id
        when 'memory' then
            case when requested_outcome = 'won'
                then least(500, 100 + requested_score / 10)
                else 10
            end
        when 'twodots' then least(500, 25 + requested_score * 5)
        when 'hexapawn' then
            case when requested_outcome = 'won' then 250 else 25 end
        when 'hangman' then
            case when requested_outcome = 'won'
                then least(
                    250,
                    150 + greatest(
                        0,
                        least(
                            9,
                            case
                                when requested_metadata ->> 'misses_remaining' ~ '^[0-9]+$'
                                    then (requested_metadata ->> 'misses_remaining')::integer
                                else 0
                            end
                        )
                    ) * 10
                )
                else 10
            end
        else 0
    end;
$$;

create or replace function public.submit_game_result(
    requested_game_id text,
    requested_rules_version smallint,
    requested_mode text,
    requested_outcome text,
    requested_score integer,
    requested_duration_ms integer,
    requested_metadata jsonb,
    requested_idempotency_key uuid
)
returns table (
    session_id uuid,
    points_awarded integer,
    total_points bigint,
    is_new_best boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    calculated_points integer;
    inserted_session_id uuid;
    previous_best integer;
    result_is_new_best boolean;
begin
    if current_user_id is null then
        raise exception using errcode = '42501', message = 'Authentication required';
    end if;

    if requested_game_id not in ('memory', 'twodots', 'hexapawn', 'hangman')
        or requested_outcome not in ('won', 'lost', 'completed')
        or requested_rules_version < 1
        or requested_score < 0
        or requested_score > 1000000
        or requested_mode !~ '^[a-z0-9-]{1,32}$'
        or requested_duration_ms is not null
            and requested_duration_ms not between 0 and 86400000
        or jsonb_typeof(coalesce(requested_metadata, '{}'::jsonb)) <> 'object'
    then
        raise exception using errcode = '22023', message = 'Invalid game result';
    end if;

    select max(gs.score)
    into previous_best
    from public.game_sessions gs
    where gs.user_id = current_user_id
      and gs.game_id = requested_game_id
      and gs.rules_version = requested_rules_version
      and gs.mode = requested_mode;

    calculated_points := public.calculate_game_points(
        requested_game_id,
        requested_outcome,
        requested_score,
        coalesce(requested_metadata, '{}'::jsonb)
    );
    result_is_new_best := previous_best is null or requested_score > previous_best;

    insert into public.game_sessions (
        user_id,
        game_id,
        rules_version,
        mode,
        outcome,
        score,
        duration_ms,
        metadata,
        idempotency_key,
        points_awarded,
        is_personal_best
    )
    values (
        current_user_id,
        requested_game_id,
        requested_rules_version,
        requested_mode,
        requested_outcome,
        requested_score,
        requested_duration_ms,
        coalesce(requested_metadata, '{}'::jsonb),
        requested_idempotency_key,
        calculated_points,
        result_is_new_best
    )
    on conflict (user_id, idempotency_key) do nothing
    returning id into inserted_session_id;

    if inserted_session_id is null then
        select gs.id, gs.points_awarded, gs.is_personal_best
        into inserted_session_id, calculated_points, result_is_new_best
        from public.game_sessions gs
        where gs.user_id = current_user_id
          and gs.idempotency_key = requested_idempotency_key;
    else
        insert into public.point_ledger (user_id, game_session_id, amount)
        values (current_user_id, inserted_session_id, calculated_points);
    end if;

    return query
    select
        inserted_session_id,
        calculated_points,
        coalesce((
            select sum(pl.amount)
            from public.point_ledger pl
            where pl.user_id = current_user_id
        ), 0),
        result_is_new_best;
end;
$$;

create or replace function public.get_my_progress()
returns table (
    total_points bigint,
    games_played bigint,
    best_scores jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
    select
        coalesce((
            select sum(pl.amount)
            from public.point_ledger pl
            where pl.user_id = auth.uid()
        ), 0),
        (
            select count(*)
            from public.game_sessions gs
            where gs.user_id = auth.uid()
        ),
        coalesce((
            select jsonb_agg(to_jsonb(best))
            from (
                select
                    gs.game_id,
                    gs.mode,
                    max(gs.score) as score
                from public.game_sessions gs
                where gs.user_id = auth.uid()
                group by gs.game_id, gs.mode
                order by gs.game_id, gs.mode
            ) best
        ), '[]'::jsonb);
$$;

alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.point_ledger enable row level security;

drop policy if exists "Los perfiles son visibles para todos" on public.profiles;
drop policy if exists "Los usuarios pueden crear su perfil" on public.profiles;
drop policy if exists "Los usuarios pueden actualizar su perfil" on public.profiles;

create policy "Players can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Players can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Players can read their own game sessions"
on public.game_sessions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Players can read their own points"
on public.point_ledger for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.game_sessions from anon, authenticated;
revoke all on table public.point_ledger from anon, authenticated;
grant select, update (nick, avatar) on table public.profiles to authenticated;
grant select on table public.game_sessions to authenticated;
grant select on table public.point_ledger to authenticated;

revoke all on function public.calculate_game_points(text, text, integer, jsonb)
from public, anon, authenticated;
revoke all on function public.submit_game_result(
    text,
    smallint,
    text,
    text,
    integer,
    integer,
    jsonb,
    uuid
) from public, anon;
grant execute on function public.submit_game_result(
    text,
    smallint,
    text,
    text,
    integer,
    integer,
    jsonb,
    uuid
) to authenticated;
revoke all on function public.get_my_progress() from public, anon;
grant execute on function public.get_my_progress() to authenticated;
