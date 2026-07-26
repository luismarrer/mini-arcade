import type { FC } from 'react'

interface GameControlsProps {
    onNewGame: () => void
    onResetStats: () => void
}

const GameControls: FC<GameControlsProps> = ({ onNewGame, onResetStats }) => {
    return (
        <section className="flex flex-row flex-wrap sm:flex-col gap-2.5 w-full">
            <button
                id="new-game"
                type="button"
                className="flex-[1_1_9rem] sm:flex-none min-h-[2.8rem] px-3.5 py-2.5 border border-[var(--hex-accent)] rounded text-[var(--hex-accent)] bg-[#101611] font-mono text-[0.68rem] font-bold tracking-wider uppercase transition-all duration-150 hover:bg-[var(--hex-accent)] hover:text-[var(--hex-bg)] hover:shadow-[0_0_1rem_rgba(0,255,65,0.25)]"
                onClick={onNewGame}
            >
                New Game
            </button>
            <button
                id="reset-stats"
                type="button"
                className="flex-[1_1_9rem] sm:flex-none min-h-[2.8rem] px-3.5 py-2.5 border border-[var(--hex-warning)] rounded text-[var(--hex-warning)] bg-[#101611] font-mono text-[0.68rem] font-bold tracking-wider uppercase transition-all duration-150 hover:bg-[var(--hex-warning)] hover:text-[var(--hex-bg)] hover:shadow-[0_0_1rem_rgba(255,107,53,0.25)]"
                onClick={onResetStats}
            >
                Reset Statistics
            </button>
        </section>
    )
}

export default GameControls
