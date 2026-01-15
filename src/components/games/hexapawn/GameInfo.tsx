import type { FC } from 'react'
import type { GameState, Stats, Player } from './hooks/useHexapawnGame'

interface GameInfoProps {
    gameState: GameState
    stats: Stats
    playerName: string
}

const GameInfo: FC<GameInfoProps> = ({ gameState, stats, playerName }) => {
    const getStatusText = (): string => {
        if (gameState.gameOver) {
            const winnerName = gameState.winner === 'player' ? playerName : 'Computer'
            return `Winner: ${winnerName}`
        }
        return gameState.currentPlayer === 'player' ? playerName : 'Computer'
    }

    return (
        <section className="game-info">
            <h2>Game Status</h2>
            <div className="stats">
                <div className="stat">
                    <span className="label">Turn:</span>
                    <span id="current-player" className="value">
                        {getStatusText()}
                    </span>
                </div>
                <div className="stat">
                    <span className="label">Wins:</span>
                    <span id="wins" className="value">
                        {stats.wins}
                    </span>
                </div>
                <div className="stat">
                    <span className="label">Losses:</span>
                    <span id="losses" className="value">
                        {stats.losses}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default GameInfo
