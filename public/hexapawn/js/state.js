// @ts-check

/**
 * @typedef {Object} Position
 * @property {number} row - Row index (0-2)
 * @property {number} col - Column index (0-2)
 */

/**
 * @typedef {Object} Move
 * @property {Position} from - Starting position
 * @property {Position} to - Target position
 * @property {boolean} isCapture - Whether this move captures a piece
 */

/**
 * @typedef {Object} GameState
 * @property {string[][]} board - 3x3 board representation
 * @property {string} currentPlayer - 'player' or 'computer'
 * @property {boolean} gameOver - Game over status
 * @property {string|null} winner - Winner of the game
 */

/** @type {GameState | null} */
export let gameState = null

/** @type {Move[]} */
export let validMoves = []

/**
 * Update the game state
 * @param {GameState | null} newState
 */
export const setGameState = (newState) => {
    gameState = newState
}

/**
 * Update the valid moves
 * @param {Move[]} moves
 */
export const setValidMoves = (moves) => {
    validMoves = moves
}
