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
}

const DotItem: FC<DotItemProps> = ({ dot, onMouseDown, onMouseEnter }) => {
    const colorClasses: Record<DotColor, string> = {
        red: "bg-[#fd0c49]",
        green: "bg-[#7ac943]",
    }

    return (
        <div
            className={`flex items-center justify-center ${dot.isMarked ? dot.color === 'red' ? 'bg-red-200/50' : 'bg-green-200/50' : ''} rounded-lg transition-colors duration-200`}
        >
            <div
                className={`w-[35px] h-[35px] rounded-full border-10 border-white cursor-pointer transition-all duration-200 hover:scale-110 ${colorClasses[dot.color]} ${dot.isMarked ? 'scale-125 shadow-lg' : ''}`}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onTouchStart={onMouseDown}
                onTouchMove={(e) => {
                    // Handle touch move for mobile
                    const touch = e.touches[0]
                    const element = document.elementFromPoint(touch.clientX, touch.clientY)
                    const dotId = element?.closest('[data-dot-id]')?.getAttribute('data-dot-id')
                    if (dotId) {
                        const event = new CustomEvent('dotTouchEnter', { detail: { dotId: parseInt(dotId) } })
                        document.dispatchEvent(event)
                    }
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
        <section id="gameContainer" className="flex-1 min-w-125 max-w-125">
            <h2 className="sr-only">Game area</h2>
            <section id="gameArea" className="relative w-full max-w-125">
                {/* Game Over Overlay */}
                {isGameOver && (
                    <div
                        id="gameOver"
                        role="region"
                        aria-label="Game over"
                        className="absolute top-0 left-0 z-10 flex flex-col justify-center items-center w-full h-full border-2 border-slate-200 rounded-t-lg backdrop-blur-[10px] bg-[rgba(102,126,234,0.1)] p-8 text-center gap-8"
                    >
                        <div className="flex flex-col justify-center items-center gap-8 pt-[130px]">
                            <h3 className="text-2xl font-medium text-[#333] m-0 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                                Game over!
                            </h3>
                            <button
                                id="newGame"
                                className="bg-linear-to-br from-[#667eea] to-[#764ba2] text-white border-none py-4 px-8 font-['Poppins',sans-serif] text-base font-medium rounded-xl w-50 cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_12px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)]"
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
                    className="relative z-1 grid justify-items-center items-center w-full aspect-square bg-white/95 border-2 border-slate-200 rounded-t-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-4 gap-2"
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
                        />
                    ))}
                </div>
            </section>

            {/* Game Title */}
            <header
                id="gameTitle"
                className="w-full bg-linear-to-br from-[#667eea] to-[#764ba2] border border-slate-200 rounded-b-lg p-4 text-white text-center shadow-[0_4px_12px_rgba(102,126,234,0.3)]"
            >
                <h1 className="text-2xl font-normal m-0">Two Dots</h1>
            </header>
        </section>
    )
}

export default GameBoard
