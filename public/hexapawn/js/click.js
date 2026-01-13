// @ts-check

import { getValidMoves } from "./gameLogic.js"
import { highlightValidMoves, selectPawn, deselectAllPawns, clearHighlights } from "./ui.js"
import { gameState } from "./state.js"

/**
 * Handle the game with clicks
 */

let selectedPawn = null

/**
 * @param {Event} event
 */
const handleClick = (event) => {
    if (!gameState) return
    
    const cell = /** @type {HTMLElement} */ (event.target)
    if (!cell) return
    
    const row = parseInt(cell.dataset.row || '0')
    const col = parseInt(cell.dataset.col || '0')
    const piece = gameState.board[row][col]
    
    // If there's a selected pawn
    if (selectedPawn) {
        // If we click the same pawn, deselect it
        if (selectedPawn.row === row && selectedPawn.col === col) {
            selectedPawn = null
            deselectAllPawns()
            clearHighlights()
            return
        }
        
        // If we click another pawn of the current player, change selection
        if (piece && piece === gameState.currentPlayer) {
            deselectAllPawns()
            clearHighlights()
            selectedPawn = { row, col }
            selectPawn(row, col)
            const validMoves = getValidMoves(selectedPawn)
            highlightValidMoves(validMoves)
            return
        }
        
        // If we click an empty or enemy cell, show valid moves
        const validMoves = getValidMoves(selectedPawn)
        highlightValidMoves(validMoves)
    } else {
        // No pawn selected, select if it belongs to the current player
        if (piece && piece === gameState.currentPlayer) {
            selectedPawn = { row, col }
            selectPawn(row, col)
            const validMoves = getValidMoves(selectedPawn)
            highlightValidMoves(validMoves)
        }
    }
}

export { handleClick }
