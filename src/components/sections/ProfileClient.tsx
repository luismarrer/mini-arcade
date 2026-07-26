import { useEffect, useState } from 'react'
import {
    getPlayerProgress,
    getUserProfile,
    signOut,
    updateProfile,
    type PlayerProgress,
    type UserProfile,
} from '../../lib/auth'
import { AVATARS, getAvatarUrl } from '../../constants/avatars'
import PlayerSlotHeader from './PlayerSlotHeader'

const emptyProgress: PlayerProgress = {
    totalPoints: 0,
    gamesPlayed: 0,
    bestScores: [],
    recentSessions: [],
}

const gameLabels: Record<string, string> = {
    memory: 'Pair Memory',
    twodots: 'Two Dots',
    hexapawn: 'Hexapawn',
    hangman: 'Hangman',
}

export default function ProfileClient() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [progress, setProgress] = useState<PlayerProgress>(emptyProgress)
    const [nick, setNick] = useState('')
    const [avatar, setAvatar] = useState('batman')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notice, setNotice] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const [profile, playerProgress] = await Promise.all([
                getUserProfile(),
                getPlayerProgress(),
            ])
            setUserProfile(profile)
            setProgress(playerProgress)
            if (profile) {
                setNick(profile.profile.nick)
                setAvatar(profile.profile.avatar)
            }
            setLoading(false)
        }

        fetchProfile()
    }, [])

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!userProfile) return

        setSaving(true)
        setNotice(null)
        setError(null)

        const { data, error: updateError } = await updateProfile({ nick, avatar })
        if (updateError || !data) {
            const message = updateError?.message ?? 'Could not update your profile.'
            setError(
                /duplicate|unique/i.test(message)
                    ? 'That nickname is already in use.'
                    : message
            )
        } else {
            setUserProfile({ ...userProfile, profile: data })
            setNick(data.nick)
            setAvatar(data.avatar)
            setNotice('Profile saved.')
        }

        setSaving(false)
    }

    const handleSignOut = async () => {
        await signOut()
        window.location.href = '/'
    }

    if (loading) {
        return (
            <div className="surface max-w-3xl p-8" aria-label="Loading profile">
                <PlayerSlotHeader label="Player slot // loading" />
                <div className="flex items-center justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-arcade-border-bright border-t-arcade-purple-bright" />
                </div>
            </div>
        )
    }

    if (!userProfile) {
        return (
            <div className="surface max-w-3xl p-8 text-center">
                <PlayerSlotHeader label="Player slot // empty" />
                <p className="mb-2 text-lg font-semibold text-[#f8f5fb]">There is no active player profile.</p>
                <p className="mb-5 text-sm text-[#b9a9c5]">Sign in to see your profile and saved points.</p>
                <a href="/login" className="button">Sign in</a>
            </div>
        )
    }

    return (
        <div className="surface max-w-3xl overflow-hidden p-6 text-arcade-text sm:p-8">
            <PlayerSlotHeader label="Player slot // active" />

            <div className="mt-6 grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)]">
                <aside className="flex flex-col items-center gap-4 text-center">
                    <img
                        src={getAvatarUrl(userProfile.profile.avatar)}
                        alt={`${userProfile.profile.nick}'s avatar`}
                        width={112}
                        height={112}
                        className="h-28 w-28 rounded-full border-2 border-arcade-border-bright bg-arcade-purple object-cover shadow-[0_0_24px_rgba(139,44,255,0.2)]"
                    />
                    <div>
                        <h2 className="mb-1 text-3xl font-extrabold tracking-[-0.04em] text-arcade-text">
                            {userProfile.profile.nick}
                        </h2>
                        <p className="m-0 text-sm text-arcade-muted [overflow-wrap:anywhere]">
                            {userProfile.user.email}
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2">
                        <div className="rounded-lg border border-arcade-border bg-arcade-bg-soft p-3">
                            <strong className="block text-2xl text-arcade-yellow">{progress.totalPoints}</strong>
                            <span className="font-mono text-[0.62rem] uppercase tracking-wider text-arcade-subtle">Points</span>
                        </div>
                        <div className="rounded-lg border border-arcade-border bg-arcade-bg-soft p-3">
                            <strong className="block text-2xl">{progress.gamesPlayed}</strong>
                            <span className="font-mono text-[0.62rem] uppercase tracking-wider text-arcade-subtle">Games</span>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0">
                    <form onSubmit={handleSave} className="flex flex-col gap-5">
                        <div>
                            <span className="eyebrow">Edit profile</span>
                            <h3 className="mt-1 text-xl font-bold">Player identity</h3>
                        </div>

                        {error && <div className="notice">{error}</div>}
                        {notice && <div className="notice notice--success">{notice}</div>}

                        <label className="field">
                            Nick
                            <input
                                type="text"
                                value={nick}
                                onChange={(event) => setNick(event.target.value)}
                                required
                                pattern="[a-zA-Z][a-zA-Z0-9]{2,14}"
                                className="input"
                            />
                        </label>

                        <fieldset className="m-0 min-w-0 border-0 p-0">
                            <legend className="mb-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-arcade-muted">
                                Avatar
                            </legend>
                            <div className="grid grid-cols-4 gap-2">
                                {AVATARS.map((item) => (
                                    <label key={item.value} className="group relative grid cursor-pointer place-items-center" title={item.label}>
                                        <input
                                            type="radio"
                                            name="profile-avatar"
                                            value={item.value}
                                            checked={avatar === item.value}
                                            onChange={() => setAvatar(item.value)}
                                            className="peer sr-only"
                                        />
                                        <img
                                            src={getAvatarUrl(item.value)}
                                            alt=""
                                            width={64}
                                            height={64}
                                            className="aspect-square w-full rounded-lg border-2 border-arcade-border bg-arcade-bg-soft object-cover p-0.5 transition peer-checked:border-arcade-yellow peer-focus-visible:ring-2 peer-focus-visible:ring-arcade-yellow"
                                        />
                                        <span className="sr-only">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <button type="submit" disabled={saving} className="button w-full disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save profile'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="my-8 h-px bg-arcade-border" />

            <section>
                <span className="eyebrow">Progress</span>
                <h3 className="mt-1 text-xl font-bold">Best scores</h3>
                {progress.bestScores.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {progress.bestScores.map((best) => (
                            <div key={`${best.gameId}:${best.mode}`} className="rounded-lg border border-arcade-border bg-arcade-bg-soft p-4">
                                <strong className="block">{gameLabels[best.gameId] ?? best.gameId}</strong>
                                <span className="text-sm text-arcade-muted">{best.mode} · {best.score} score</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-arcade-muted">Complete a supported game to start your history.</p>
                )}
            </section>

            {progress.recentSessions.length > 0 && (
                <section className="mt-8">
                    <span className="eyebrow">Recent activity</span>
                    <h3 className="mt-1 text-xl font-bold">Latest games</h3>
                    <div className="mt-4 overflow-hidden rounded-lg border border-arcade-border">
                        {progress.recentSessions.map((session) => (
                            <div
                                key={session.id}
                                className="flex flex-wrap items-center justify-between gap-3 border-b border-arcade-border bg-arcade-bg-soft px-4 py-3 last:border-b-0"
                            >
                                <div>
                                    <strong className="block">{gameLabels[session.game_id] ?? session.game_id}</strong>
                                    <span className="text-xs text-arcade-muted">
                                        {session.mode} · {new Date(session.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <strong className="block">{session.score} score</strong>
                                    <span className="font-mono text-xs text-arcade-yellow">
                                        +{session.points_awarded} points
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <button
                onClick={handleSignOut}
                className="mt-8 w-full rounded-lg border border-[#874052] bg-[#2a1724] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#ff9aa9] transition hover:bg-[#3a1b2b]"
            >
                Sign out
            </button>
        </div>
    )
}
