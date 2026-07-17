import type { FC } from "react"
import type { Dot, DotColor } from "./hooks/useTwodotsGame"

interface GameBoardProps {
    dots: Dot[]
    size: number
    isGameOver: boolean
    onStartMarking: (dotId: number) => void
    onContinueMarking: (dotId: number) => void
    onFinishMarking: () => void
    onPlayAgain: () => void
}

interface DotItemProps {
    dot: Dot
    onMouseDown: () => void
    onMouseEnter: () => void
    onTouchMove: (dotId: number) => void
}

const DotItem: FC<DotItemProps> = ({ dot, onMouseDown, onMouseEnter, onTouchMove }) => {
    const colorClasses: Record<DotColor, string> = {
        red: "bg-[#fd0c49]",
        green: "bg-[#7ac943]",
    }

    return (
        <div
            className={`flex items-center justify-center rounded-lg transition-colors duration-200 ${dot.isMarked ? dot.color === 'red' ? 'bg-[#fd0c49]/12' : 'bg-[#7ac943]/15' : ''}`}
        >
            <div
                className={`touch-none h-[clamp(1.25rem,7vw,2.2rem)] w-[clamp(1.25rem,7vw,2.2rem)] cursor-pointer rounded-full border-[clamp(0.28rem,1.4vw,0.58rem)] border-white shadow-[0_2px_8px_rgba(35,27,55,0.08)] transition-all duration-200 hover:scale-110 ${colorClasses[dot.color]} ${dot.isMarked ? 'scale-125 shadow-[0_5px_15px_rgba(35,27,55,0.2)]' : ''}`}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onTouchStart={onMouseDown}
                onTouchMove={(event) => {
                    event.preventDefault()
                    const touch = event.touches[0]
                    const element = document.elementFromPoint(touch.clientX, touch.clientY)
                    const dotId = element?.closest('[data-dot-id]')?.getAttribute('data-dot-id')
                    if (dotId) onTouchMove(Number(dotId))
                }}
                data-dot-id={dot.id}
            />
        </div>
    )
}

const GameBoard: FC<GameBoardProps> = ({
    dots,
    size,
    isGameOver,
    onStartMarking,
    onContinueMarking,
    onFinishMarking,
    onPlayAgain,
}) => {
    return (
        <section id="gameContainer" className="mx-auto w-full min-w-0 max-w-[31rem]">
            <h2 className="sr-only">Game area</h2>
            <section id="gameArea" className="relative w-full">
                {/* Game Over Overlay */}
                {isGameOver && (
                    <div
                        id="gameOver"
                        role="region"
                        aria-label="Game over"
                        className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-6 rounded-t-xl border border-[#d9d8e4] bg-white/82 p-6 text-center backdrop-blur-[10px]"
                    >
                        <div className="flex flex-col items-center justify-center gap-5">
                            <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#716887]">Time</span>
                            <h3 className="m-0 text-4xl font-black tracking-[-0.04em] text-[#27223a]">
                                Game over
                            </h3>
                            <button
                                id="newGame"
                                className="cursor-pointer rounded-lg border border-[#8d80d7] bg-linear-to-r from-[#667eea] to-[#764ba2] py-3 px-6 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_rgba(102,126,234,0.3)] transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#667eea]/25"
                                onClick={onPlayAgain}
                            >
                                Play again
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Board */}
                <div
                    id="game"
                    role="grid"
                    aria-label="Two Dots game board"
                    className="relative z-1 grid aspect-square w-full items-center justify-items-center gap-1.5 rounded-t-xl border border-[#dedde7] bg-white p-2 shadow-[0_16px_44px_rgba(7,3,20,0.22)] sm:gap-2 sm:p-4"
                    style={{
                        gridTemplateColumns: `repeat(${size}, 1fr)`,
                        gridTemplateRows: `repeat(${size}, 1fr)`,
                    }}
                    onMouseUp={onFinishMarking}
                    onMouseLeave={onFinishMarking}
                    onTouchEnd={onFinishMarking}
                >
                    {dots.map((dot) => (
                        <DotItem
                            key={dot.id}
                            dot={dot}
                            onMouseDown={() => onStartMarking(dot.id)}
                            onMouseEnter={() => onContinueMarking(dot.id)}
                            onTouchMove={onContinueMarking}
                        />
                    ))}
                </div>
            </section>

            {/* Game Title */}
            <header
                id="gameTitle"
                className="w-full rounded-b-xl border border-t-0 border-[#8d80d7] bg-linear-to-r from-[#667eea] to-[#764ba2] p-4 text-center text-white shadow-[0_12px_30px_rgba(102,126,234,0.24)]"
            >
                <h2 className="m-0 text-2xl font-black tracking-[-0.035em]">Two Dots</h2>
                <p className="mt-0.5 mb-0 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/75">Connect adjacent colors</p>
            </header>
        </section>
    )
}

export default GameBoard
