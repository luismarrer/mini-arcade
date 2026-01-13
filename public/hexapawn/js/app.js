// @ts-check

/**
 * The app.js file is the main file of the game.
 * Here the game is initialized and the main functions are defined.
 * This is where all the logic begins.
 */

import { $ } from './myjquery.js'
import { gameState, setGameState } from './state.js'
import { getComputerMove, makeMove, getAllValidMovesForPlayer } from './gameLogic.js'
import { updateBoardDisplay, updateDisplay, updateStats, endGame, showStats } from './ui.js'
import { getStats, saveStats, saveGameState, loadGameState, savePlayerName, getPlayerName, getInitialState } from './storage.js'
import { setupDragAndDrop } from './dragAndDrop.js'
import { handleClick } from './click.js'


// Save player name
const playerForm = document.getElementById('player-name-form')
if (playerForm) {
    savePlayerName(/** @type {HTMLFormElement} */ (playerForm))
}

/**
 * Show the player's name
 */
const showPlayerName = () => {
    // Get the player's name
    const playerName = getPlayerName()
    // Get the player name element
    const playerNameElement = $('current-player')
    if (playerNameElement) {
        playerNameElement.textContent = playerName || 'Player'
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

    // Update global state before any other operation
    setGameState(newState)
    
    // Update the board visually
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
    updateStats(stats, gameState?.winner)
    saveGameState()
}

const startNewGame = () => {
    const newState = getInitialState()
    setGameState(newState)
    updateBoardDisplay(newState)
    updateAndSave()
}

const resetStats = () => {
    if (confirm('Are you sure you want to reset the statistics?')) {
        saveStats({ wins: 0, losses: 0 })
        showStats()
        updateAndSave()
    }
}

const startOldGame = () => {
    loadGameState()
}

/**
 * Initialize the game
 */

const initGame = () => {
    showPlayerName()

    // Handle player moves
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
        // Update board with loaded state
        updateBoardDisplay(state)
        showStats()
        startOldGame()
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame)
} else {
    initGame()
}
