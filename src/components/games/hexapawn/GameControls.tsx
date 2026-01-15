import type { FC } from 'react'

interface GameControlsProps {
    onNewGame: () => void
    onResetStats: () => void
}

const GameControls: FC<GameControlsProps> = ({ onNewGame, onResetStats }) => {
    return (
        <section className="game-controls">
            <button
                id="new-game"
                className="btn btn-primary"
                onClick={onNewGame}
            >
                New Game
            </button>
            <button
                id="reset-stats"
                className="btn btn-secondary"
                onClick={onResetStats}
            >
                Reset Statistics
            </button>
        </section>
    )
}

export default GameControls
