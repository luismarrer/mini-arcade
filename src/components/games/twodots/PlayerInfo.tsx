import type { FC } from "react"

interface PlayerInfoProps {
    avatarSrc: string
    onBackToConfig: () => void
}

const PlayerInfo: FC<PlayerInfoProps> = ({ avatarSrc, onBackToConfig }) => {
    return (
        <aside id="userContainer" className="text-black">
            <h2>Player information</h2>
            <section id="userInfo" role="region" aria-label="Player information">
                <img src={avatarSrc} id="avatarImg" alt="Player avatar" />
                <p id="nick" aria-label="Player name" />
                <div className="user-stats">
                    <p id="boardSize" aria-label="Board size" />
                    <p id="score" aria-label="Current score">
                        Score: 0
                    </p>
                    <p id="timer" aria-label="Remaining time">
                        Remaining time: 60
                    </p>
                </div>
            </section>
            <nav className="mt-4">
                <button
                    type="button"
                    className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-700 transition-colors text-white"
                    onClick={onBackToConfig}
                >
                    Back to configuration
                </button>
            </nav>
        </aside>
    )
}

export default PlayerInfo
