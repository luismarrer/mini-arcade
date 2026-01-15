import type { FC } from 'react'
import type { GameState, Move } from './hooks/useHexapawnGame'

interface PawnProps {
    player: string
    isSelected: boolean
    isDisabled: boolean
    isDraggable: boolean
    row: number
    col: number
    onDragStart: () => void
    onDragEnd: () => void
}

const Pawn: FC<PawnProps> = ({
    player,
    isSelected,
    isDisabled,
    isDraggable,
    row,
    col,
    onDragStart,
    onDragEnd,
}) => {
    const symbol = player === 'player' ? '♙' : '♟'
    const pawnClass = player === 'player' ? 'player-pawn' : 'computer-pawn'

    return (
        <div
            className={`pawn ${pawnClass} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            data-player={player}
            data-row={row}
            data-col={col}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            {symbol}
        </div>
    )
}

interface CellProps {
    row: number
    col: number
    piece: string
    isValidMove: boolean
    isSelected: boolean
    gameOver: boolean
    currentPlayer: string
    onClick: () => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onDragStart: () => void
    onDragEnd: () => void
}

const Cell: FC<CellProps> = ({
    row,
    col,
    piece,
    isValidMove,
    isSelected,
    gameOver,
    currentPlayer,
    onClick,
    onDragOver,
    onDrop,
    onDragStart,
    onDragEnd,
}) => {
    return (
        <div
            className={`cell ${isValidMove ? 'valid-move' : ''}`}
            data-row={row}
            data-col={col}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {piece && (
                <Pawn
                    player={piece}
                    isSelected={isSelected}
                    isDisabled={gameOver}
                    isDraggable={!gameOver && piece === currentPlayer && piece === 'player'}
                    row={row}
                    col={col}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                />
            )}
        </div>
    )
}

interface GameBoardProps {
    gameState: GameState
    isValidMoveCell: (row: number, col: number) => boolean
    isPawnSelected: (row: number, col: number) => boolean
    onCellClick: (row: number, col: number) => void
    onDragStart: (row: number, col: number) => void
    onDragOver: (e: React.DragEvent, row: number, col: number) => void
    onDrop: (e: React.DragEvent, row: number, col: number) => void
    onDragEnd: () => void
}

const GameBoard: FC<GameBoardProps> = ({
    gameState,
    isValidMoveCell,
    isPawnSelected,
    onCellClick,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
}) => {
    return (
        <section className="game-board-container">
            <h2 className="visually-hidden">Hexapawn Board</h2>
            <div
                id="game-board"
                className={`game-board ${gameState.gameOver ? 'game-over' : ''}`}
            >
                {gameState.board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            row={rowIndex}
                            col={colIndex}
                            piece={cell}
                            isValidMove={isValidMoveCell(rowIndex, colIndex)}
                            isSelected={isPawnSelected(rowIndex, colIndex)}
                            gameOver={gameState.gameOver}
                            currentPlayer={gameState.currentPlayer}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            onDragOver={(e) => onDragOver(e, rowIndex, colIndex)}
                            onDrop={(e) => onDrop(e, rowIndex, colIndex)}
                            onDragStart={() => onDragStart(rowIndex, colIndex)}
                            onDragEnd={onDragEnd}
                        />
                    ))
                )}
            </div>
        </section>
    )
}

export default GameBoard
