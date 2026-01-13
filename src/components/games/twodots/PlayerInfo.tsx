import type { FC } from "react"

interface PlayerInfoProps {
    avatarSrc: string
    size: number
    score: number
    timeRemaining: number
    onBackToConfig: () => void
}

const PlayerInfo: FC<PlayerInfoProps> = ({ 
    avatarSrc, 
    size, 
    score, 
    timeRemaining, 
    onBackToConfig 
}) => {
    return (
        <aside
            id="userContainer"
            className="w-80 bg-white/95 rounded-2xl p-6 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.1)] h-fit text-black"
        >
            <h2 className="text-lg font-semibold mb-4">Player information</h2>
            <section id="userInfo" role="region" aria-label="Player information">
                <img
                    src={avatarSrc}
                    id="avatarImg"
                    alt="Player avatar"
                    className="border border-gray-300 p-2 rounded-lg mb-4 w-20 h-20 object-cover"
                />
                <div className="user-stats flex flex-col gap-2">
                    <p aria-label="Board size" className="text-sm font-light">
                        <span className="font-medium">Size:</span> {size}x{size}
                    </p>
                    <p aria-label="Current score" className="text-sm font-light">
                        <span className="font-medium">Score:</span> {score}
                    </p>
                    <p 
                        aria-label="Remaining time" 
                        className={`text-sm font-light ${timeRemaining <= 10 ? 'text-red-600 font-semibold' : ''}`}
                    >
                        <span className="font-medium">Remaining time:</span> {timeRemaining}s
                    </p>
                </div>
            </section>
            <nav className="mt-6">
                <button
                    type="button"
                    className="w-full px-4 py-2 rounded bg-slate-600 hover:bg-slate-700 transition-colors text-white"
                    onClick={onBackToConfig}
                >
                    Back to configuration
                </button>
            </nav>
        </aside>
    )
}

export default PlayerInfo
