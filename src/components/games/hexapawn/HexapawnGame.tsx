import type { FC } from 'react'
import { useHexapawnGame } from './hooks/useHexapawnGame'
import GameInfo from './GameInfo'
import GameBoard from './GameBoard'
import GameControls from './GameControls'

const HexapawnGame: FC = () => {
    const {
        gameState,
        stats,
        playerName,
        handleCellClick,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        startNewGame,
        resetStats,
        isValidMoveCell,
        isPawnSelected,
    } = useHexapawnGame()

    return (
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)] gap-5 overflow-hidden p-4 sm:p-6 border border-[#304235] rounded-xl text-[#effff2] [--hex-accent:#00ff41] [--hex-warning:#ff6b35] [--hex-bg:#070a08] bg-[var(--hex-bg)] [background-image:linear-gradient(rgba(0,255,65,0.018)_50%,transparent_50%),radial-gradient(circle_at_35%_30%,rgba(0,255,65,0.055),transparent_42%)] [background-size:100%_4px,auto] shadow-[0_1.5rem_4rem_rgba(0,0,0,0.35),inset_0_0_3rem_rgba(0,0,0,0.5)] font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(11rem,0.55fr)_minmax(18rem,1fr)] gap-4 items-start min-w-0">
                <div className="flex flex-col gap-4">
                    <GameInfo
                        gameState={gameState}
                        stats={stats}
                        playerName={playerName}
                    />
                    <GameControls
                        onNewGame={startNewGame}
                        onResetStats={resetStats}
                    />
                </div>
                <GameBoard
                    gameState={gameState}
                    isValidMoveCell={isValidMoveCell}
                    isPawnSelected={isPawnSelected}
                    onCellClick={handleCellClick}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                />
            </div>
            <div className="p-4 border border-[#304235] rounded-md bg-[#101611]/92">
                <span className="text-[var(--hex-accent)] text-[0.68rem] font-bold tracking-widest uppercase [text-shadow:0_0_0.65rem_rgba(0,255,65,0.35)]">HEXAPAWN RULES</span>
                <h2 className="my-3 text-white font-mono text-[clamp(1.35rem,3vw,1.75rem)] font-bold tracking-tight">How to play</h2>
                <ul className="flex flex-col gap-3 m-0 p-0 list-none text-[#91a895] text-[0.82rem] leading-relaxed">
                    <li className="relative pl-5 before:absolute before:left-0 before:text-[var(--hex-accent)] before:content-['>']">Pawns move forward 1 square to an empty space.</li>
                    <li className="relative pl-5 before:absolute before:left-0 before:text-[var(--hex-accent)] before:content-['>']">Pawns capture diagonally forward 1 square.</li>
                    <li className="relative pl-5 before:absolute before:left-0 before:text-[var(--hex-accent)] before:content-['>']">Win by reaching the opponent's back row, capturing all opponent pawns, or leaving them with no legal moves.</li>
                </ul>
            </div>
        </div>
    )
}

export default HexapawnGame
