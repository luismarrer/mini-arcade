import type { FC } from 'react'
import type { GameState } from './hooks/useHexapawnGame'

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
    const colorClass = player === 'player' ? 'text-[var(--hex-accent)] drop-shadow-[0_0_0.75rem_rgba(0,255,65,0.65)]' : 'text-[var(--hex-warning)] drop-shadow-[0_0_0.75rem_rgba(255,107,53,0.55)]'

    return (
        <div
            className={`relative z-10 flex w-[clamp(2.7rem,8vw,4.5rem)] h-[clamp(2.7rem,8vw,4.5rem)] items-center justify-center border rounded text-[clamp(2.2rem,7vw,3.8rem)] select-none transition-all duration-150 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:scale-105 ${colorClass} ${isSelected ? 'border-[var(--hex-accent)] bg-[rgba(0,255,65,0.14)] shadow-[0_0_0.9rem_rgba(0,255,65,0.34)]' : 'border-transparent'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    const bgClass = (row + col) % 2 === 1 ? 'bg-[#111713]' : 'bg-[#18201a]'

    return (
        <button
            type="button"
            className={`relative flex aspect-square items-center justify-center border-0 p-0 cursor-pointer transition-colors duration-150 ${isValidMove ? 'bg-[rgba(0,255,65,0.16)] hover:bg-[rgba(0,255,65,0.16)] shadow-[inset_0_0_1.1rem_rgba(0,255,65,0.22)] after:absolute after:w-4 after:h-4 after:border-2 after:border-[var(--hex-accent)] after:rounded-full after:bg-[rgba(0,255,65,0.14)] after:shadow-[0_0_0.7rem_rgba(0,255,65,0.5)] after:content-[""]' : `${bgClass} hover:bg-[#202c23]`}`}
            data-row={row}
            data-col={col}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            aria-label={`${piece ? `${piece} pawn` : 'Empty cell'} at row ${row + 1}, column ${col + 1}${isValidMove ? ', valid move' : ''}`}
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
        </button>
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
        <section className="w-full max-w-[31rem] justify-self-center">
            <h2 className="sr-only">Hexapawn Board</h2>
            <div
                id="game-board"
                className={`grid grid-cols-3 gap-0.5 overflow-hidden p-0.5 border-4 border-[var(--hex-accent)] rounded-lg bg-[#0b9132] shadow-[0_0_1.6rem_rgba(0,255,65,0.18),inset_0_0_1rem_rgba(0,0,0,0.75)] ${gameState.gameOver ? 'animate-hex-finish motion-reduce:animate-none' : ''}`}
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
