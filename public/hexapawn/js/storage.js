// @ts-check

import { $ } from './myjquery.js'
import { gameState, setGameState } from './state.js'

/**
 * Save player name with sessionStorage
 * @param {HTMLFormElement} form
 */
export const savePlayerName = (form) => {
    // Listen for form submit event
    if (!form) return
    form.addEventListener('submit', (event) => {
        const name = /** @type {HTMLInputElement} */ ($('player-name'))?.value
        if (name) {
            localStorage.setItem('player-name', name)
        }
    })
}

/**
 * Get player name
 */
export const getPlayerName = () => {
    const playerName = localStorage.getItem('player-name')
    if (playerName) {
       return playerName
    }
}

/**
 * Initial state for each new game
 */
export const getInitialState = () => ({
    board: [
        ['computer', 'computer', 'computer'], // row 1 computer pawns
        ['', '', ''], // row 2
        ['player', 'player', 'player'], // row 3 player pawns
    ],
    currentPlayer: 'player', // player's turn
    gameOver: false, // if the game is over
    winner: null, // winner
})


/**
 * Get statistics from localStorage
 * @returns {{wins: number, losses: number}}
 */
export const getStats = () => {
    const saved = localStorage.getItem('hexapawn-stats')
    if (saved) {
        try {
            return JSON.parse(saved)
        } catch (error) {
            console.warn('Failed to load stats:', error)
        }
    }
    return { wins: 0, losses: 0 }
}

/**
 * Save statistics to localStorage
 * @param {{wins: number, losses: number}} stats
 */
export const saveStats = (stats) => {
    localStorage.setItem('hexapawn-stats', JSON.stringify(stats))
}

/**
 * Save game state to localStorage
 */
export const saveGameState = () => {
    if (gameState) {
        localStorage.setItem('hexapawn-game-state', JSON.stringify(gameState))
    }
}

/**
 * Load game state from localStorage
 */
export const loadGameState = () => {
    const saved = localStorage.getItem('hexapawn-game-state')
    if (saved) {
        try {
            const savedState = JSON.parse(saved)
            // Validate saved state structure
            if (savedState.board && Array.isArray(savedState.board) && savedState.board.length === 3) {
                setGameState(savedState)
            }
        } catch (error) {
            console.warn('Failed to load saved game state:', error)
        }
    }
}
