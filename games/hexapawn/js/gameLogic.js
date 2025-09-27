// @ts-check

import { gameState, setGameState } from './state.js'

/**
 * Get all valid moves for a pawn at given position
 * @param {import('./state.js').Position} from - The starting position of the pawn
 * @returns {import('./state.js').Move[]}
 */
export const getValidMoves = (from) => {
    const moves = []
    if (!gameState) return moves

    const player = gameState.board[from.row][from.col]
    if (!player) return moves

    const direction = player === 'player' ? -1 : 1
    const newRow = from.row + direction

    if (newRow < 0 || newRow > 2) return moves

    // Forward move
    if (gameState.board[newRow][from.col] === '') {
        moves.push({
            from,
            to: { row: newRow, col: from.col },
            isCapture: false,
        })
    }

    // Diagonal captures
    for (const colOffset of [-1, 1]) {
        const newCol = from.col + colOffset
        if (newCol >= 0 && newCol <= 2) {
            const targetPiece = gameState.board[newRow][newCol]
            if (targetPiece && targetPiece !== player) {
                moves.push({
                    from,
                    to: { row: newRow, col: newCol },
                    isCapture: true,
                })
            }
        }
    }

    return moves
}

/**
 * Make a move on the board and change the current player to the other one. Changes the game state and returns it.
 * @param {import('./state.js').Move} move
 */
export const makeMove = (move) => {
    if (!gameState) return console.error('No game state found')

    const { from, to } = move
    const player = gameState.board[from.row][from.col]

    const newBoard = gameState.board.map(r => [...r])
    newBoard[to.row][to.col] = player
    newBoard[from.row][from.col] = ''

    let newGameState = {
        ...gameState,
        board: newBoard,
    }

    // Actualizar el estado global
    setGameState(newGameState)

    if (checkWinCondition(newGameState)) {
        newGameState.gameOver = true
    } else {
        newGameState.currentPlayer = gameState.currentPlayer === 'player' ? 'computer' : 'player'
    }

    return newGameState
}

/**
 * Get all valid moves for a player
 * @param {string} player
 * @returns {import('./state.js').Move[]}
 */
export const getAllValidMovesForPlayer = (player) => {
    const moves = []
    if (!gameState) return moves

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameState.board[row][col] === player) {
                const pawnMoves = getValidMoves({ row, col })
                moves.push(...pawnMoves)
            }
        }
    }


    return moves
}

/**
 * Check win conditions
 * @returns {boolean}
 */
export const checkWinCondition = (currentState) => {
    if (!currentState) return false

    // Check if any pawn reached the opposite end
    for (let col = 0; col < 3; col++) {
        if (currentState.board[0][col] === 'player') {
            currentState.winner = 'player'
            return true
        }
        if (currentState.board[2][col] === 'computer') {
            currentState.winner = 'computer'
            return true
        }
    }

    // Check if current player has no valid moves
    const opponentMoves = getAllValidMovesForPlayer(currentState.currentPlayer)
    console.log(opponentMoves)
    if (opponentMoves.length === 0) {
        currentState.winner = currentState.currentPlayer === 'player' ? 'player' : 'computer'
        return true
    }

    return false
}


export const getComputerMove = () => {
    if (!gameState) return null

    const computerMoves = getAllValidMovesForPlayer('computer')

    if (computerMoves.length === 0) {
        return 'no-moves'
    }

    // Simple AI: prioritize captures, then random move
    return computerMoves.find(move => move.isCapture) ||
        computerMoves[Math.floor(Math.random() * computerMoves.length)]
}
