// @ts-check

import { $ } from './myjquery.js'
import { gameState, setGameState } from './state.js'
import { getComputerMove, makeMove } from './gameLogic.js'
import { updateBoardDisplay, updateDisplay, updateStats, endGame } from './ui.js'
import { getStats, saveStats, saveGameState, loadGameState, savePlayerName, getPlayerName, getInitialState } from './storage.js'
import { handleDragStart, handleDragOver, handleDrop } from './dragAndDrop.js'
import { handleClick } from './click.js'


// Guardar nombre del jugador
const playerForm = document.getElementById('player-name-form')
if (playerForm) {
    savePlayerName(/** @type {HTMLFormElement} */ (playerForm))
}

/**
 * Mostrar el nombre del jugador
 */
const showPlayerName = () => {
    // recuperar el nombre del jugador
    const playerName = getPlayerName()
    // recuperar el elemento del nombre del jugador
    const playerNameElement = $('current-player')
    if (playerNameElement) {
        playerNameElement.textContent = playerName || 'Jugador'
    }
}


const handleComputerTurn = () => {
    const move = getComputerMove()
    if (move === 'no-moves') {
        endGame('player')
        updateAndSave()
    } else if (move) {
        handleMove(move)
    }
}

/**
 * @param {import('./state.js').Move} move
 */
const handleMove = (move) => {
    const newState = makeMove(move)
    if (!newState) return

    if (newState.gameOver && newState.winner) {
        endGame(newState.winner)
    } else if (newState.currentPlayer === 'computer') {
        setTimeout(handleComputerTurn, 500)
    }

    updateAndSave()
}

const updateAndSave = () => {
    updateBoardDisplay()
    updateDisplay()
    const stats = getStats()
    updateStats(stats)
    saveGameState()
}

const startNewGame = () => {
    const newState = getInitialState()
    setGameState(newState)
    updateBoardDisplay(newState)
    updateAndSave()
}

const resetStats = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar las estadísticas?')) {
        saveStats({ wins: 0, losses: 0 })
        updateAndSave()
    }
}

const initGame = () => {
    showPlayerName()

    // manejar movimientos del jugador
    const board = document.getElementById('game-board')
    if (board) {
        board.addEventListener('dragstart', handleDragStart)
        board.addEventListener('dragover', handleDragOver)
        board.addEventListener('click', handleClick)
        // Custom event to handle move after drop
        board.addEventListener('drop', (e) => {
            handleDrop(e)

            if (!e.dataTransfer || !e.target) return

            const fromRow = parseInt(e.dataTransfer.getData('text/plain').split(',')[0])
            const fromCol = parseInt(e.dataTransfer.getData('text/plain').split(',')[1])
            const cell = /** @type {HTMLElement} */ (e.target).closest('.cell')

            if (!cell) return

            const toRow = parseInt(cell.dataset.row || '0')
            const toCol = parseInt(cell.dataset.col || '0')

            const move = {
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol },
                isCapture: !!(gameState && gameState.board[toRow][toCol]),
            }
            handleMove(move)
        })
    }

    const newGameBtn = document.getElementById('new-game')
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame)
    }

    const resetStatsBtn = document.getElementById('reset-stats')
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', resetStats)
    }

    loadGameState()
    const state = gameState
    if (!state || !state.board) {
        startNewGame()
    } else {
        updateAndSave()
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame)
} else {
    initGame()
}
