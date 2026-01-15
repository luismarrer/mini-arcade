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
        <>
            <GameInfo
                gameState={gameState}
                stats={stats}
                playerName={playerName}
            />
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
            <GameControls
                onNewGame={startNewGame}
                onResetStats={resetStats}
            />
        </>
    )
}

export default HexapawnGame
