import type { FC } from "react"
import { useEffect, useState } from "react"

type Player = "player" | "computer"

interface Position {
    row: number
    col: number
}

interface Move {
    from: Position
    to: Position
    isCapture: boolean
}

interface GameState {
    board: string[][]
    currentPlayer: Player
    gameOver: boolean
    winner: Player | null
}

interface Stats {
    wins: number
    losses: number
}

const getInitialState = (): GameState => ({
    board: [
        ["computer", "computer", "computer"],
        ["", "", ""],
        ["player", "player", "player"],
    ],
    currentPlayer: "player",
    gameOver: false,
    winner: null,
})

const getValidMoves = (from: Position, state: GameState): Move[] => {
    const moves: Move[] = []
    const player = state.board[from.row][from.col]
    if (!player) return moves

    const direction = player === "player" ? -1 : 1
    const newRow = from.row + direction

    if (newRow < 0 || newRow > 2) return moves

    // Forward move
    if (state.board[newRow][from.col] === "") {
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

const checkWinCondition = (state: GameState): boolean => {
    // Check if any pawn reached the opposite end
    for (let col = 0; col < 3; col++) {
        if (state.board[0][col] === "player") {
            state.winner = "player"
            return true
        }
        if (state.board[2][col] === "computer") {
            state.winner = "computer"
            return true
        }
    }

    // Check if current player has no valid moves
    const opponentMoves = getAllValidMovesForPlayer(state.currentPlayer, state)
    if (opponentMoves.length === 0) {
        state.winner = state.currentPlayer === "player" ? "computer" : "player"
        return true
    }

    return false
}

const makeMove = (move: Move, state: GameState): GameState => {
    const { from, to } = move
    const player = state.board[from.row][from.col]

    const newBoard = state.board.map((r) => [...r])
    newBoard[to.row][to.col] = player
    newBoard[from.row][from.col] = ""

    const newState: GameState = {
        ...state,
        board: newBoard,
    }

    if (checkWinCondition(newState)) {
        newState.gameOver = true
    } else {
        newState.currentPlayer = state.currentPlayer === "player" ? "computer" : "player"
    }

    return newState
}

const getComputerMove = (state: GameState): Move | null => {
    const computerMoves = getAllValidMovesForPlayer("computer", state)

    if (computerMoves.length === 0) {
        return null
    }

    // Simple AI: prioritize captures, then random move
    return (
        computerMoves.find((move) => move.isCapture) ||
        computerMoves[Math.floor(Math.random() * computerMoves.length)]
    )
}

const HexapawnGameClient: FC = () => {
    const [gameState, setGameState] = useState<GameState>(getInitialState())
    const [stats, setStats] = useState<Stats>({ wins: 0, losses: 0 })
    const [playerName, setPlayerName] = useState<string>("Player")
    const [selectedPawn, setSelectedPawn] = useState<Position | null>(null)
    const [validMoves, setValidMoves] = useState<Move[]>([])
    const [draggedPawn, setDraggedPawn] = useState<Position | null>(null)

    // Load stats and player name from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return

        const savedStats = localStorage.getItem("hexapawn-stats")
        if (savedStats) {
            try {
                setStats(JSON.parse(savedStats))
            } catch (error) {
                console.warn("Failed to load stats:", error)
            }
        }

        const savedName = localStorage.getItem("player-name")
        if (savedName) {
            setPlayerName(savedName)
        }

        const savedState = localStorage.getItem("hexapawn-game-state")
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState)
                if (parsedState.board && Array.isArray(parsedState.board) && parsedState.board.length === 3) {
                    setGameState(parsedState)
                }
            } catch (error) {
                console.warn("Failed to load game state:", error)
            }
        }
    }, [])

    // Save game state to localStorage
    useEffect(() => {
        if (typeof window === "undefined") return
        localStorage.setItem("hexapawn-game-state", JSON.stringify(gameState))
    }, [gameState])

    // Handle computer turn
    useEffect(() => {
        if (gameState.currentPlayer === "computer" && !gameState.gameOver) {
            const timer = setTimeout(() => {
                const move = getComputerMove(gameState)
                if (move) {
                    const newState = makeMove(move, gameState)
                    setGameState(newState)
                    
                    if (newState.gameOver && newState.winner === "computer") {
                        updateStats("computer")
                    }
                } else {
                    // Computer has no moves, player wins
                    const newState = { ...gameState, gameOver: true, winner: "player" as Player }
                    setGameState(newState)
                    updateStats("player")
                }
            }, 1500)

            return () => clearTimeout(timer)
        }
    }, [gameState.currentPlayer, gameState.gameOver])

    const updateStats = (winner: Player) => {
        if (typeof window === "undefined") return

        const newStats = { ...stats }
        if (winner === "player") {
            newStats.wins++
        } else {
            newStats.losses++
        }
        setStats(newStats)
        localStorage.setItem("hexapawn-stats", JSON.stringify(newStats))
    }

    const handleCellClick = (row: number, col: number) => {
        if (gameState.gameOver || gameState.currentPlayer !== "player") return

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
            if (piece === "player") {
                setSelectedPawn({ row, col })
                const moves = getValidMoves({ row, col }, gameState)
                setValidMoves(moves)
                return
            }

            // Try to make a move
            const move = validMoves.find((m) => m.to.row === row && m.to.col === col)
            if (move) {
                const newState = makeMove(move, gameState)
                setGameState(newState)
                setSelectedPawn(null)
                setValidMoves([])

                if (newState.gameOver && newState.winner === "player") {
                    updateStats("player")
                }
            }
        } else {
            // No pawn selected, select if it belongs to the player
            if (piece === "player") {
                setSelectedPawn({ row, col })
                const moves = getValidMoves({ row, col }, gameState)
                setValidMoves(moves)
            }
        }
    }

    const handleDragStart = (row: number, col: number) => {
        if (gameState.gameOver || gameState.currentPlayer !== "player") return
        if (gameState.board[row][col] !== "player") return

        setDraggedPawn({ row, col })
        const moves = getValidMoves({ row, col }, gameState)
        setValidMoves(moves)
    }

    const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
        const isValid = validMoves.some((m) => m.to.row === row && m.to.col === col)
        if (isValid) {
            e.preventDefault()
        }
    }

    const handleDrop = (e: React.DragEvent, row: number, col: number) => {
        e.preventDefault()

        if (!draggedPawn) return

        const move = validMoves.find((m) => m.to.row === row && m.to.col === col)
        if (move) {
            const newState = makeMove(move, gameState)
            setGameState(newState)

            if (newState.gameOver && newState.winner === "player") {
                updateStats("player")
            }
        }

        setDraggedPawn(null)
        setValidMoves([])
    }

    const handleDragEnd = () => {
        setDraggedPawn(null)
        setValidMoves([])
    }

    const startNewGame = () => {
        setGameState(getInitialState())
        setSelectedPawn(null)
        setValidMoves([])
    }

    const resetStats = () => {
        if (confirm("Are you sure you want to reset the statistics?")) {
            const newStats = { wins: 0, losses: 0 }
            setStats(newStats)
            localStorage.setItem("hexapawn-stats", JSON.stringify(newStats))
        }
    }

    const isValidMoveCell = (row: number, col: number) => {
        return validMoves.some((m) => m.to.row === row && m.to.col === col)
    }

    const isPawnSelected = (row: number, col: number) => {
        return selectedPawn?.row === row && selectedPawn?.col === col
    }

    return (
        <>
            <section className="game-info">
                <h2>Game Status</h2>
                <div className="stats">
                    <div className="stat">
                        <span className="label">Turn:</span>
                        <span id="current-player" className="value">
                            {gameState.gameOver
                                ? `Winner: ${gameState.winner === "player" ? playerName : "Computer"}`
                                : gameState.currentPlayer === "player"
                                  ? playerName
                                  : "Computer"}
                        </span>
                    </div>
                    <div className="stat">
                        <span className="label">Wins:</span>
                        <span id="wins" className="value">
                            {stats.wins}
                        </span>
                    </div>
                    <div className="stat">
                        <span className="label">Losses:</span>
                        <span id="losses" className="value">
                            {stats.losses}
                        </span>
                    </div>
                </div>
            </section>
            <section className="game-board-container">
                <h2 className="visually-hidden">Hexapawn Board</h2>
                <div id="game-board" className={`game-board ${gameState.gameOver ? "game-over" : ""}`}>
                    {gameState.board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`cell ${isValidMoveCell(rowIndex, colIndex) ? "valid-move" : ""}`}
                                data-row={rowIndex}
                                data-col={colIndex}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                            >
                                {cell && (
                                    <div
                                        className={`pawn ${cell}-pawn ${isPawnSelected(rowIndex, colIndex) ? "selected" : ""} ${gameState.gameOver ? "disabled" : ""}`}
                                        data-player={cell}
                                        data-row={rowIndex}
                                        data-col={colIndex}
                                        draggable={
                                            !gameState.gameOver &&
                                            cell === gameState.currentPlayer &&
                                            cell === "player"
                                        }
                                        onDragStart={() => handleDragStart(rowIndex, colIndex)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        {cell === "player" ? "♙" : "♟"}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="game-controls">
                <button id="new-game" className="btn btn-primary" onClick={startNewGame}>
                    New Game
                </button>
                <button id="reset-stats" className="btn btn-secondary" onClick={resetStats}>
                    Reset Statistics
                </button>
            </section>
        </>
    )
}

export default HexapawnGameClient
