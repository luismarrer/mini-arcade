import type { FC } from 'react'
import type { GameState, Stats } from './hooks/useHexapawnGame'

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
        <section className="p-4 border border-[#304235] rounded-md bg-[#101611]/92 shadow-[inset_0_0_1.5rem_rgba(0,255,65,0.025)]">
            <h2 className="m-0 mb-4 text-[#91a895] font-mono text-[0.68rem] font-bold tracking-widest uppercase"><span className="mr-2 text-[var(--hex-accent)]">&gt;</span>Match status</h2>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-2.5">
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between gap-1 sm:gap-3 pt-2.5 border-t border-[#304235] text-center sm:text-left">
                    <span className="text-[#91a895] text-[0.68rem] font-bold tracking-wider uppercase">Turn:</span>
                    <span id="current-player" className="text-[var(--hex-accent)] text-sm sm:text-base font-bold drop-shadow-[0_0_0.65rem_rgba(0,255,65,0.42)]">
                        {getStatusText()}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between gap-1 sm:gap-3 pt-2.5 border-t border-[#304235] text-center sm:text-left">
                    <span className="text-[#91a895] text-[0.68rem] font-bold tracking-wider uppercase">Wins:</span>
                    <span id="wins" className="text-[var(--hex-accent)] text-sm sm:text-base font-bold drop-shadow-[0_0_0.65rem_rgba(0,255,65,0.42)]">
                        {stats.wins}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between gap-1 sm:gap-3 pt-2.5 border-t border-[#304235] text-center sm:text-left">
                    <span className="text-[#91a895] text-[0.68rem] font-bold tracking-wider uppercase">Losses:</span>
                    <span id="losses" className="text-[var(--hex-accent)] text-sm sm:text-base font-bold drop-shadow-[0_0_0.65rem_rgba(0,255,65,0.42)]">
                        {stats.losses}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default GameInfo
