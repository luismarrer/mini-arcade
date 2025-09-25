// @ts-check

import { getValidMoves } from "./gameLogic.js"
import { highlightValidMoves, selectPawn, deselectAllPawns, clearHighlights } from "./ui.js"
import { gameState } from "./state.js"

/**
 * Manejar el juego con clicks
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
    
    // Si hay un peón seleccionado
    if (selectedPawn) {
        // Si clickeamos el mismo peón, lo deseleccionamos
        if (selectedPawn.row === row && selectedPawn.col === col) {
            selectedPawn = null
            deselectAllPawns()
            clearHighlights()
            return
        }
        
        // Si clickeamos otro peón del jugador actual, cambiamos la selección
        if (piece && piece === gameState.currentPlayer) {
            deselectAllPawns()
            clearHighlights()
            selectedPawn = { row, col }
            selectPawn(row, col)
            const validMoves = getValidMoves(selectedPawn)
            highlightValidMoves(validMoves)
            return
        }
        
        // Si clickeamos una celda vacía o enemiga, mostrar movimientos válidos
        const validMoves = getValidMoves(selectedPawn)
        highlightValidMoves(validMoves)
    } else {
        // No hay peón seleccionado, seleccionar si es del jugador actual
        if (piece && piece === gameState.currentPlayer) {
            selectedPawn = { row, col }
            selectPawn(row, col)
            const validMoves = getValidMoves(selectedPawn)
            highlightValidMoves(validMoves)
        }
    }
}

export { handleClick }
