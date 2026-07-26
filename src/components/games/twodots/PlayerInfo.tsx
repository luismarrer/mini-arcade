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
            className="h-fit w-full overflow-hidden rounded-xl border border-[#dedde7] bg-white text-[#27223a] shadow-[0_16px_44px_rgba(7,3,20,0.18)] short-landscape:self-stretch"
        >
            <div className="flex h-1" aria-hidden="true">
                <span className="flex-1 bg-[#fd0c49]" />
                <span className="flex-1 bg-[#667eea]" />
                <span className="flex-1 bg-[#7ac943]" />
            </div>
            <div className="p-5 short-landscape:p-3">
                <h2 className="mb-4 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#716887] short-landscape:mb-2">Player</h2>
                <section id="userInfo" role="region" aria-label="Player information" className="grid grid-cols-[3.5rem_1fr] items-center gap-4 lg:grid-cols-1 short-landscape:grid-cols-[2.75rem_1fr] short-landscape:gap-3">
                    <img
                        src={avatarSrc}
                        id="avatarImg"
                        alt="Player avatar"
                        className="h-14 w-14 rounded-lg border border-[#d3d0df] bg-[#f5f3fa] p-1 object-cover short-landscape:size-11"
                    />
                    <div className="user-stats grid grid-cols-3 gap-3 lg:grid-cols-1 short-landscape:grid-cols-1 short-landscape:gap-1">
                        <p aria-label="Board size" className="m-0 text-sm text-[#5c536d]">
                            <span className="font-semibold text-[#27223a]">Size:</span> {size}x{size}
                        </p>
                        <p aria-label="Current score" className="m-0 text-sm text-[#5c536d]">
                            <span className="font-semibold text-[#27223a]">Score:</span> {score}
                        </p>
                        <p
                            aria-label="Remaining time"
                            className={`m-0 text-sm text-[#5c536d] ${timeRemaining <= 10 ? 'text-[#d10b42] font-bold' : ''}`}
                        >
                            <span className="font-semibold text-[#27223a]">Time:</span> {timeRemaining}s
                        </p>
                    </div>
                </section>
                <nav className="mt-6 short-landscape:mt-3">
                    <button
                        type="button"
                        className="w-full min-h-11 rounded-lg border border-[#c9c5d7] bg-[#f5f3fa] px-4 py-2.5 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.05em] text-[#39314d] transition-colors hover:border-[#9c91b8] hover:bg-[#eeeaf6] focus:outline-none focus:ring-4 focus:ring-[#667eea]/20"
                        onClick={onBackToConfig}
                    >
                        Back to configuration
                    </button>
                </nav>
            </div>
        </aside>
    )
}

export default PlayerInfo
