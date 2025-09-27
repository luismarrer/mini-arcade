// @ts-check

import { gameState, setGameState } from './state.js'
import { getPlayerName } from './storage.js'

/**
 * Update the board display
 */
export const updateBoardDisplay = (newState) => {
    const board = document.getElementById('game-board')
    if (!board || !newState) return

    board.innerHTML = ''

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            cell.dataset.row = row.toString()
            cell.dataset.col = col.toString()

            const piece = newState.board[row][col]
            if (piece) {
                const pawn = document.createElement('div')
                pawn.className = `pawn ${piece}-pawn`
                pawn.dataset.player = piece
                pawn.dataset.row = row.toString()
                pawn.dataset.col = col.toString()
                pawn.textContent = piece === 'player' ? '♙' : '♟'

                if (!newState.gameOver && piece === newState.currentPlayer) {
                    pawn.draggable = true
                } else {
                    pawn.draggable = false
                    if (newState.gameOver) {
                        pawn.classList.add('disabled')
                    }
                }

                cell.appendChild(pawn)
            }

            board.appendChild(cell)
        }
    }
}

/**
 * Update all display elements
 */
export const updateDisplay = () => {
    if (!gameState) return

    // Update current player
    const currentPlayerElement = document.getElementById('current-player')
    if (currentPlayerElement) {
        currentPlayerElement.textContent = gameState.gameOver
            ? `Ganador: ${gameState.winner === 'player' ? 'Jugador' : 'Computadora'}`
            : gameState.currentPlayer === 'player' ? getPlayerName() || 'Jugador' : 'Computadora'
    }

}

/**
 * @param {{ wins: number; losses: number; }} stats
 */
export const updateStats = (stats) => {
    const winsElement = document.getElementById('wins')
    const lossesElement = document.getElementById('losses')

    if (winsElement) {
        winsElement.textContent = stats.wins.toString()
    }

    if (lossesElement) {
        lossesElement.textContent = stats.losses.toString()
    }
}

/**
 * End the game
 * @param {string} winner
 */
export const endGame = (winner) => {
    if (!gameState) return

    const newGameState = { ...gameState, gameOver: true, winner }
    setGameState(newGameState)
    
    // Actualizar el tablero con el nuevo estado
    updateBoardDisplay(newGameState)

    // Disable all pawns
    document.querySelectorAll('.pawn').forEach(pawn => {
        const pawnElement = /** @type {HTMLElement} */ (pawn)
        pawnElement.classList.add('disabled')
        pawnElement.draggable = false
    })

    // Add visual feedback
    const gameBoard = document.getElementById('game-board')
    if (gameBoard) {
        gameBoard.classList.add('game-over')
    }

    updateDisplay()
}

/**
 * Clear all highlights
 */
export const clearHighlights = () => {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('valid-move', 'drag-over')
    })
}

/**
 * Highlight valid moves
 * @param {import('./state.js').Move[]} validMoves
 */
export const highlightValidMoves = (validMoves) => {
    clearHighlights()
    validMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.to.row}"][data-col="${move.to.col}"]`)
        if (cell) {
            cell.classList.add('valid-move')
        }
    })
}

/**
 * Select a pawn visually
 * @param {number} row
 * @param {number} col
 */
export const selectPawn = (row, col) => {
    const pawn = document.querySelector(`[data-row="${row}"][data-col="${col}"] .pawn`)
    if (pawn) {
        pawn.classList.add('selected')
    }
}

/**
 * Deselect all pawns visually
 */
export const deselectAllPawns = () => {
    document.querySelectorAll('.pawn.selected').forEach(pawn => {
        pawn.classList.remove('selected')
    })
}
