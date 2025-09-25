// @ts-check

import { $ } from './myjquery.js'
import { gameState, setGameState } from './state.js'

/**
 * Guardar nombre del jugador con sessionStorage
 * @param {HTMLFormElement} form
 */
export const savePlayerName = (form) => {
    // Escuchar el evento submit del formulario
    if (!form) return
    form.addEventListener('submit', (event) => {
        const name = /** @type {HTMLInputElement} */ ($('player-name'))?.value
        if (name) {
            sessionStorage.setItem('player-name', name)
        }
    })
}

/**
 * Recuperar nombre del jugador
 */
export const getPlayerName = () => {
    const playerName = sessionStorage.getItem('player-name')
    if (playerName) {
       return playerName
    }
}

/**
 * Estado inicial de cada juego nuevo
 */
export const getInitialState = () => ({
    board: [
        ['computer', 'computer', 'computer'], // fila 1 peones de la computadora
        ['', '', ''], // fila 2
        ['player', 'player', 'player'], // fila 3 peones del jugador
    ],
    currentPlayer: 'player', // turno del jugador
    gameOver: false, // si el juego termino
    winner: null, // ganador
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
    console.log('Game state saved', gameState)
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
