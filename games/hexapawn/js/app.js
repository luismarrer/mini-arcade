// @ts-check

/**
 * El archivo app.js es el archivo principal del juego.
 * Aquí se inicializa el juego y se definen las funciones principales.
 * Es por donde comienza toda la lógica.
 */

import { $ } from './myjquery.js'
import { gameState, setGameState } from './state.js'
import { getComputerMove, makeMove } from './gameLogic.js'
import { updateBoardDisplay, updateDisplay, updateStats, endGame } from './ui.js'
import { getStats, saveStats, saveGameState, loadGameState, savePlayerName, getPlayerName, getInitialState } from './storage.js'
import { setupDragAndDrop } from './dragAndDrop.js'
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
export const handleMove = (move) => {
    const newState = makeMove(move)
    if (!newState) return console.log('Invalid move')

    // Actualizar el estado global antes de cualquier otra operación
    setGameState(newState)
    
    // Actualizar el tablero visualmente
    updateBoardDisplay(newState)
    
    if (newState.gameOver && newState.winner) {
        endGame(newState.winner)
    } else if (newState.currentPlayer === 'computer') {
        setTimeout(handleComputerTurn, 1500)
    }

    updateAndSave()
}

const updateAndSave = () => {
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

/**
 * Inicializar el juego
 */

const initGame = () => {
    showPlayerName()

    // manejar movimientos del jugador
    const board = document.getElementById('game-board')
    if (board) {
        setupDragAndDrop(board, handleMove)
        board.addEventListener('click', handleClick)
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
        // Actualizar el tablero con el estado cargado
        updateBoardDisplay(state)
        updateAndSave()
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame)
} else {
    initGame()
}
