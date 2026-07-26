drop trigger if exists update_profiles_updated_at on public.profiles;
drop function if exists public.update_updated_at_column();

revoke all on function public.handle_new_user()
from public, anon, authenticated;

alter function public.get_my_progress() security invoker;
