// @ts-check

import { gameState, validMoves, setValidMoves } from './state.js'
import { getValidMoves } from './gameLogic.js'
import { clearHighlights, highlightValidMoves } from './ui.js'

let draggedPawn = null
let handleMoveCallback = null


/**
 * Check if a move is valid
 * @param {import('./state.js').Move} move
 * @returns {boolean}
 */
const isValidMove = (move) => {
    const validMovesForPawn = getValidMoves(move.from)
    return validMovesForPawn.some(validMove => 
        validMove.to.row === move.to.row && validMove.to.col === move.to.col
    )
}

/**
 * Handle drag start event
 * @param {DragEvent} event
 */
const handleDragStart = (event) => {
    const pawn = /** @type {HTMLElement} */ (event.target)
    if (!pawn || !pawn.classList || !pawn.classList.contains('pawn')) return console.error('Invalid pawn element')
    
    const player = pawn.dataset.player
    if (!gameState || player !== gameState.currentPlayer || gameState.gameOver) {
        event.preventDefault()
        return console.error('Invalid player or game over')
    }

    draggedPawn = pawn
    pawn.classList.add('dragging')
    
    const row = parseInt(pawn.dataset.row || '0')
    const col = parseInt(pawn.dataset.col || '0')
    const newValidMoves = getValidMoves({ row, col })
    setValidMoves(newValidMoves)

    highlightValidMoves(newValidMoves)

    // Set drag data
    if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', `${row},${col}`)
        event.dataTransfer.effectAllowed = 'move'
    }
}

/**
 * Handle drag over event
 * @param {DragEvent} event
 */
const handleDragOver = (event) => {
    const target = /** @type {HTMLElement} */ (event.target)
    if (!target) return
    
    const cell = /** @type {HTMLElement} */ (target.closest('.cell'))
    if (!cell) return

    const row = parseInt(cell.dataset.row || '0')
    const col = parseInt(cell.dataset.col || '0')
    
    const isValid = validMoves.some(move =>
        move.to.row === row && move.to.col === col
    )

    if (isValid) {
        event.preventDefault()
        cell.classList.add('drag-over')
    }
}

/**
 * Handle drop event
 * @param {DragEvent} event
 */
const handleDrop = (event) => {
    event.preventDefault()
    
    const target = /** @type {HTMLElement} */ (event.target)
    if (!target) return
    
    const cell = /** @type {HTMLElement} */ (target.closest('.cell'))
    if (!cell) return

    const toRow = parseInt(cell.dataset.row || '0')
    const toCol = parseInt(cell.dataset.col || '0')
    
    if (!event.dataTransfer) return
    
    const dragData = event.dataTransfer.getData('text/plain')
    const [fromRow, fromCol] = dragData.split(',').map(Number)
    
    const move = {
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        isCapture: !!gameState?.board[toRow][toCol],
    }

    if (isValidMove(move) && handleMoveCallback) {
        handleMoveCallback(move)
    }
    
    // Clean up drag over styling
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('drag-over'))
    clearHighlights()
    
    // Clean up dragging class
    if (draggedPawn) {
        draggedPawn.classList.remove('dragging')
        draggedPawn = null
    }
}

/**
 * Setup drag and drop handlers
 * @param {HTMLElement} board - The game board element
 * @param {(move: import('./state.js').Move) => void} moveHandler - Callback to handle moves
 */
export const setupDragAndDrop = (board, moveHandler) => {
    handleMoveCallback = moveHandler
    board.addEventListener('dragstart', handleDragStart)
    board.addEventListener('dragover', handleDragOver)
    board.addEventListener('drop', handleDrop)
    
    // Add dragend event to clean up
    board.addEventListener('dragend', (event) => {
        const target = /** @type {HTMLElement} */ (event.target)
        if (target && target.classList.contains('pawn')) {
            target.classList.remove('dragging')
        }
        clearHighlights()
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('drag-over'))
    })
}
