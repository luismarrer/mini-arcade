import { useState, useCallback, useEffect } from 'react'

export type Player = 'player' | 'computer'

export interface Position {
    row: number
    col: number
}

export interface Move {
    from: Position
    to: Position
    isCapture: boolean
}

export interface GameState {
    board: string[][]
    currentPlayer: Player
    gameOver: boolean
    winner: Player | null
}

export interface Stats {
    wins: number
    losses: number
}

const STORAGE_KEYS = {
    STATS: 'hexapawn-stats',
    GAME_STATE: 'hexapawn-game-state',
    PLAYER_NAME: 'player-name',
} as const

const getInitialBoard = (): string[][] => [
    ['computer', 'computer', 'computer'],
    ['', '', ''],
    ['player', 'player', 'player'],
]

const getInitialState = (): GameState => ({
    board: getInitialBoard(),
    currentPlayer: 'player',
    gameOver: false,
    winner: null,
})

const getValidMoves = (from: Position, state: GameState): Move[] => {
    const moves: Move[] = []
    const player = state.board[from.row][from.col]
    if (!player) return moves

    const direction = player === 'player' ? -1 : 1
    const newRow = from.row + direction

    if (newRow < 0 || newRow > 2) return moves

    // Forward move
    if (state.board[newRow][from.col] === '') {
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
            const targetPiece = state.board[newRow][newCol]
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

const getAllValidMovesForPlayer = (player: string, state: GameState): Move[] => {
    const moves: Move[] = []

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (state.board[row][col] === player) {
                const pawnMoves = getValidMoves({ row, col }, state)
                moves.push(...pawnMoves)
            }
        }
    }

    return moves
}

const checkWinCondition = (state: GameState): Player | null => {
    // Check if any pawn reached the opposite end
    for (let col = 0; col < 3; col++) {
        if (state.board[0][col] === 'player') {
            return 'player'
        }
        if (state.board[2][col] === 'computer') {
            return 'computer'
        }
    }

    // Check if current player has no valid moves (they lose)
    const currentPlayerMoves = getAllValidMovesForPlayer(state.currentPlayer, state)
    if (currentPlayerMoves.length === 0) {
        return state.currentPlayer === 'player' ? 'computer' : 'player'
    }

    return null
}

const applyMove = (move: Move, state: GameState): GameState => {
    const { from, to } = move
    const player = state.board[from.row][from.col]

    const newBoard = state.board.map((r) => [...r])
    newBoard[to.row][to.col] = player
    newBoard[from.row][from.col] = ''

    const newState: GameState = {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'player' ? 'computer' : 'player',
    }

    const winner = checkWinCondition(newState)
    if (winner) {
        newState.gameOver = true
        newState.winner = winner
    }

    return newState
}

const getComputerMove = (state: GameState): Move | null => {
    const computerMoves = getAllValidMovesForPlayer('computer', state)

    if (computerMoves.length === 0) {
        return null
    }

    // Simple AI: prioritize captures, then random move
    return (
        computerMoves.find((move) => move.isCapture) ||
        computerMoves[Math.floor(Math.random() * computerMoves.length)]
    )
}

export const useHexapawnGame = () => {
    const [gameState, setGameState] = useState<GameState>(getInitialState)
    const [stats, setStats] = useState<Stats>({ wins: 0, losses: 0 })
    const [playerName, setPlayerName] = useState<string>('Player')
    const [selectedPawn, setSelectedPawn] = useState<Position | null>(null)
    const [validMoves, setValidMoves] = useState<Move[]>([])
    const [draggedPawn, setDraggedPawn] = useState<Position | null>(null)

    // Load saved data from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return

        const savedStats = localStorage.getItem(STORAGE_KEYS.STATS)
        if (savedStats) {
            try {
                setStats(JSON.parse(savedStats))
            } catch (error) {
                console.warn('Failed to load stats:', error)
            }
        }

        const savedName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME)
        if (savedName) {
            setPlayerName(savedName)
        }

        const savedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState)
                if (parsedState.board && Array.isArray(parsedState.board) && parsedState.board.length === 3) {
                    setGameState(parsedState)
                }
            } catch (error) {
                console.warn('Failed to load game state:', error)
            }
        }
    }, [])

    // Save game state to localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState))
    }, [gameState])

    const updateStats = useCallback((winner: Player) => {
        if (typeof window === 'undefined') return

        setStats((prevStats) => {
            const newStats = { ...prevStats }
            if (winner === 'player') {
                newStats.wins++
            } else {
                newStats.losses++
            }
            localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats))
            return newStats
        })
    }, [])

    // Handle computer turn
    useEffect(() => {
        if (gameState.currentPlayer !== 'computer' || gameState.gameOver) return

        const timer = setTimeout(() => {
            const move = getComputerMove(gameState)
            if (move) {
                const newState = applyMove(move, gameState)
                setGameState(newState)

                if (newState.gameOver && newState.winner) {
                    updateStats(newState.winner)
                }
            } else {
                // Computer has no moves, player wins
                const newState: GameState = {
                    ...gameState,
                    gameOver: true,
                    winner: 'player',
                }
                setGameState(newState)
                updateStats('player')
            }
        }, 1500)

        return () => clearTimeout(timer)
    }, [gameState, updateStats])

    const handleCellClick = useCallback((row: number, col: number) => {
        if (gameState.gameOver || gameState.currentPlayer !== 'player') return

        const piece = gameState.board[row][col]

        // If there's a selected pawn
        if (selectedPawn) {
            // If we click the same pawn, deselect it
            if (selectedPawn.row === row && selectedPawn.col === col) {
                setSelectedPawn(null)
                setValidMoves([])
                return
            }

            // If we click another player's pawn, change selection
            if (piece === 'player') {
                setSelectedPawn({ row, col })
                const moves = getValidMoves({ row, col }, gameState)
                setValidMoves(moves)
                return
            }

            // Try to make a move
            const move = validMoves.find((m) => m.to.row === row && m.to.col === col)
            if (move) {
                const newState = applyMove(move, gameState)
                setGameState(newState)
                setSelectedPawn(null)
                setValidMoves([])

                if (newState.gameOver && newState.winner) {
                    updateStats(newState.winner)
                }
            }
        } else {
            // No pawn selected, select if it belongs to the player
            if (piece === 'player') {
                setSelectedPawn({ row, col })
                const moves = getValidMoves({ row, col }, gameState)
                setValidMoves(moves)
            }
        }
    }, [gameState, selectedPawn, validMoves, updateStats])

    const handleDragStart = useCallback((row: number, col: number) => {
        if (gameState.gameOver || gameState.currentPlayer !== 'player') return
        if (gameState.board[row][col] !== 'player') return

        setDraggedPawn({ row, col })
        const moves = getValidMoves({ row, col }, gameState)
        setValidMoves(moves)
    }, [gameState])

    const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
        const isValid = validMoves.some((m) => m.to.row === row && m.to.col === col)
        if (isValid) {
            e.preventDefault()
        }
    }, [validMoves])

    const handleDrop = useCallback((e: React.DragEvent, row: number, col: number) => {
        e.preventDefault()

        if (!draggedPawn) return

        const move = validMoves.find((m) => m.to.row === row && m.to.col === col)
        if (move) {
            const newState = applyMove(move, gameState)
            setGameState(newState)

            if (newState.gameOver && newState.winner) {
                updateStats(newState.winner)
            }
        }

        setDraggedPawn(null)
        setValidMoves([])
    }, [draggedPawn, validMoves, gameState, updateStats])

    const handleDragEnd = useCallback(() => {
        setDraggedPawn(null)
        setValidMoves([])
    }, [])

    const startNewGame = useCallback(() => {
        setGameState(getInitialState())
        setSelectedPawn(null)
        setValidMoves([])
    }, [])

    const resetStats = useCallback(() => {
        if (typeof window === 'undefined') return
        if (!confirm('Are you sure you want to reset the statistics?')) return

        const newStats = { wins: 0, losses: 0 }
        setStats(newStats)
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats))
    }, [])

    const isValidMoveCell = useCallback((row: number, col: number) => {
        return validMoves.some((m) => m.to.row === row && m.to.col === col)
    }, [validMoves])

    const isPawnSelected = useCallback((row: number, col: number) => {
        return selectedPawn?.row === row && selectedPawn?.col === col
    }, [selectedPawn])

    return {
        // State
        gameState,
        stats,
        playerName,
        validMoves,

        // Actions
        handleCellClick,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        startNewGame,
        resetStats,

        // Helpers
        isValidMoveCell,
        isPawnSelected,
    }
}
