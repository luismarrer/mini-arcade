// @ts-check

/**
 * Hexapawn Game Implementation
 * A 3x3 mini-chess game with pawns only
 */

/**
 * @typedef {Object} GameState
 * @property {string[][]} board - 3x3 board representation
 * @property {string} currentPlayer - 'player' or 'computer'
 * @property {boolean} gameOver - Game over status
 * @property {string|null} winner - Winner of the game
 */

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

class HexapawnGame {
    constructor() {
        this.gameState = this.getInitialState()
        this.draggedPawn = null
        this.validMoves = []
        
        this.initializeEventListeners()
        this.loadGameState()
        this.updateDisplay()
    }

    /**
     * Get initial game state
     * @returns {GameState}
     */
    getInitialState() {
        return {
            board: [
                ['computer', 'computer', 'computer'],
                ['', '', ''],
                ['player', 'player', 'player']
            ],
            currentPlayer: 'player',
            gameOver: false,
            winner: null
        }
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Drag and drop events
        document.addEventListener('dragstart', this.handleDragStart.bind(this))
        document.addEventListener('dragend', this.handleDragEnd.bind(this))
        document.addEventListener('dragover', this.handleDragOver.bind(this))
        document.addEventListener('drop', this.handleDrop.bind(this))

        // Button events
        const newGameBtn = document.getElementById('new-game')
        const resetStatsBtn = document.getElementById('reset-stats')
        
        if (newGameBtn) {
            newGameBtn.addEventListener('click', this.startNewGame.bind(this))
        }
        
        if (resetStatsBtn) {
            resetStatsBtn.addEventListener('click', this.resetStats.bind(this))
        }

        // Keyboard support
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    /**
     * Handle drag start event
     * @param {DragEvent} event
     */
    handleDragStart(event) {
        const pawn = /** @type {HTMLElement} */ (event.target)
        if (!pawn || !pawn.classList || !pawn.classList.contains('pawn')) return
        
        const player = pawn.dataset.player
        if (player !== this.gameState.currentPlayer || this.gameState.gameOver) {
            event.preventDefault()
            return
        }

        this.draggedPawn = pawn
        pawn.classList.add('dragging')
        
        const row = parseInt(pawn.dataset.row || '0')
        const col = parseInt(pawn.dataset.col || '0')
        this.validMoves = this.getValidMoves({ row, col })
        
        this.highlightValidMoves()
        
        // Set drag data
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', `${row},${col}`)
            event.dataTransfer.effectAllowed = 'move'
        }
    }

    /**
     * Handle drag end event
     * @param {DragEvent} event
     */
    handleDragEnd(event) {
        if (this.draggedPawn) {
            this.draggedPawn.classList.remove('dragging')
            this.draggedPawn = null
        }
        this.clearHighlights()
        this.validMoves = []
    }

    /**
     * Handle drag over event
     * @param {DragEvent} event
     */
    handleDragOver(event) {
        const target = /** @type {HTMLElement} */ (event.target)
        if (!target) return
        
        const cell = /** @type {HTMLElement} */ (target.closest('.cell'))
        if (!cell) return

        const row = parseInt(cell.dataset.row || '0')
        const col = parseInt(cell.dataset.col || '0')
        
        const isValidMove = this.validMoves.some(move => 
            move.to.row === row && move.to.col === col
        )
        
        if (isValidMove) {
            event.preventDefault()
            cell.classList.add('drag-over')
        }
    }

    /**
     * Handle drop event
     * @param {DragEvent} event
     */
    handleDrop(event) {
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
            isCapture: this.gameState.board[toRow][toCol] !== ''
        }
        
        if (this.isValidMove(move)) {
            this.makeMove(move)
        }
        
        // Clean up drag over styling
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('drag-over'))
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this.clearHighlights()
        }
    }

    /**
     * Get all valid moves for a pawn at given position
     * @param {Position} from - The starting position of the pawn
     * @returns {Move[]}
     */
    getValidMoves(from) {
        const moves = []
        const player = this.gameState.board[from.row][from.col]
        
        if (!player) return moves
        
        const direction = player === 'player' ? -1 : 1
        const newRow = from.row + direction
        
        // Check if new row is within bounds
        if (newRow < 0 || newRow > 2) return moves
        
        // Forward move
        if (this.gameState.board[newRow][from.col] === '') {
            moves.push({
                from,
                to: { row: newRow, col: from.col },
                isCapture: false
            })
        }
        
        // Diagonal captures
        for (const colOffset of [-1, 1]) {
            const newCol = from.col + colOffset
            if (newCol >= 0 && newCol <= 2) {
                const targetPiece = this.gameState.board[newRow][newCol]
                if (targetPiece && targetPiece !== player) {
                    moves.push({
                        from,
                        to: { row: newRow, col: newCol },
                        isCapture: true
                    })
                }
            }
        }
        
        return moves
    }

    /**
     * Check if a move is valid
     * @param {Move} move
     * @returns {boolean}
     */
    isValidMove(move) {
        const validMoves = this.getValidMoves(move.from)
        return validMoves.some(validMove => 
            validMove.to.row === move.to.row && validMove.to.col === move.to.col
        )
    }

    /**
     * Make a move on the board
     * @param {Move} move
     */
    makeMove(move) {
        const { from, to } = move
        const player = this.gameState.board[from.row][from.col]
        
        // Update board state
        this.gameState.board[to.row][to.col] = player
        this.gameState.board[from.row][from.col] = ''
        
        // Update DOM
        this.updateBoardDisplay()
        
        // Check for win condition
        if (this.checkWinCondition() && this.gameState.winner) {
            this.endGame(this.gameState.winner)
            return
        }
        
        // Switch players
        this.gameState.currentPlayer = this.gameState.currentPlayer === 'player' ? 'computer' : 'player'
        this.updateDisplay()
        
        // Save game state
        this.saveGameState()
        
        // If it's computer's turn, make computer move
        if (this.gameState.currentPlayer === 'computer' && !this.gameState.gameOver) {
            setTimeout(() => this.makeComputerMove(), 500)
        }
    }

    /**
     * Make a computer move using simple AI
     */
    makeComputerMove() {
        const computerMoves = this.getAllValidMovesForPlayer('computer')
        
        if (computerMoves.length === 0) {
            this.endGame('player')
            return
        }
        
        // Simple AI: prioritize captures, then random move
        let selectedMove = computerMoves.find(move => move.isCapture) || 
                          computerMoves[Math.floor(Math.random() * computerMoves.length)]
        
        this.makeMove(selectedMove)
    }

    /**
     * Get all valid moves for a player
     * @param {string} player
     * @returns {Move[]}
     */
    getAllValidMovesForPlayer(player) {
        const moves = []
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.gameState.board[row][col] === player) {
                    const pawnMoves = this.getValidMoves({ row, col })
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
    checkWinCondition() {
        // Check if any pawn reached the opposite end
        for (let col = 0; col < 3; col++) {
            if (this.gameState.board[0][col] === 'player') {
                this.gameState.winner = 'player'
                return true
            }
            if (this.gameState.board[2][col] === 'computer') {
                this.gameState.winner = 'computer'
                return true
            }
        }
        
        // Check if current player has no valid moves
        const currentPlayerMoves = this.getAllValidMovesForPlayer(this.gameState.currentPlayer)
        if (currentPlayerMoves.length === 0) {
            this.gameState.winner = this.gameState.currentPlayer === 'player' ? 'computer' : 'player'
            return true
        }
        
        return false
    }

    /**
     * End the game
     * @param {string} winner
     */
    endGame(winner) {
        this.gameState.gameOver = true
        this.gameState.winner = winner
        
        // Update statistics
        const stats = this.getStats()
        if (winner === 'player') {
            stats.wins++
        } else {
            stats.losses++
        }
        this.saveStats(stats)
        
        // Disable all pawns
        document.querySelectorAll('.pawn').forEach(pawn => {
            const pawnElement = /** @type {HTMLElement} */ (pawn)
            pawnElement.classList.add('disabled')
            pawnElement.draggable = false
        })
        
        // Add visual feedback
        const gameBoard = document.getElementById('game-board')
        if (gameBoard) {
            gameBoard.classList.add('game-over')
        }
        
        this.updateDisplay()
        this.saveGameState()
        
        // Show result message
        setTimeout(() => {
            const message = winner === 'player' ? '¡Ganaste!' : 'Perdiste. ¡Inténtalo de nuevo!'
            alert(message)
        }, 100)
    }

    /**
     * Start a new game
     */
    startNewGame() {
        this.gameState = this.getInitialState()
        this.updateBoardDisplay()
        this.updateDisplay()
        this.saveGameState()
        
        // Re-enable pawns
        document.querySelectorAll('.pawn').forEach(pawn => {
            const pawnElement = /** @type {HTMLElement} */ (pawn)
            pawnElement.classList.remove('disabled')
            if (pawnElement.dataset.player === 'player') {
                pawnElement.draggable = true
            }
        })
        
        // Remove game over styling
        const gameBoard = document.getElementById('game-board')
        if (gameBoard) {
            gameBoard.classList.remove('game-over')
        }
    }

    /**
     * Highlight valid moves
     */
    highlightValidMoves() {
        this.validMoves.forEach(move => {
            const cell = document.querySelector(`[data-row="${move.to.row}"][data-col="${move.to.col}"]`)
            if (cell) {
                cell.classList.add('valid-move')
            }
        })
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('valid-move', 'drag-over')
        })
    }

    /**
     * Update the board display
     */
    updateBoardDisplay() {
        const board = document.getElementById('game-board')
        if (!board) return
        
        board.innerHTML = ''
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement('div')
                cell.className = 'cell'
                cell.dataset.row = row.toString()
                cell.dataset.col = col.toString()
                
                const piece = this.gameState.board[row][col]
                if (piece) {
                    const pawn = document.createElement('div')
                    pawn.className = `pawn ${piece}-pawn`
                    pawn.dataset.player = piece
                    pawn.dataset.row = row.toString()
                    pawn.dataset.col = col.toString()
                    pawn.textContent = piece === 'player' ? '♙' : '♟'
                    
                    if (!this.gameState.gameOver && piece === this.gameState.currentPlayer) {
                        pawn.draggable = true
                    } else {
                        pawn.draggable = false
                        if (this.gameState.gameOver) {
                            pawn.classList.add('disabled')
                        }
                    }
                    
                    cell.appendChild(pawn)
                }
                
                board.appendChild(cell)
            }
        }
    }

    /**
     * Update all display elements
     */
    updateDisplay() {
        // Update current player
        const currentPlayerElement = document.getElementById('current-player')
        if (currentPlayerElement) {
            currentPlayerElement.textContent = this.gameState.gameOver 
                ? `Ganador: ${this.gameState.winner === 'player' ? 'Jugador' : 'Computadora'}`
                : this.gameState.currentPlayer === 'player' ? 'Jugador' : 'Computadora'
        }
        
        // Update statistics
        const stats = this.getStats()
        const winsElement = document.getElementById('wins')
        const lossesElement = document.getElementById('losses')
        
        if (winsElement) {
            winsElement.textContent = stats.wins.toString()
        }
        
        if (lossesElement) {
            lossesElement.textContent = stats.losses.toString()
        }
    }

    /**
     * Save game state to localStorage
     */
    saveGameState() {
        localStorage.setItem('hexapawn-game-state', JSON.stringify(this.gameState))
    }

    /**
     * Load game state from localStorage
     */
    loadGameState() {
        const saved = localStorage.getItem('hexapawn-game-state')
        if (saved) {
            try {
                const savedState = JSON.parse(saved)
                // Validate saved state structure
                if (savedState.board && Array.isArray(savedState.board) && savedState.board.length === 3) {
                    this.gameState = savedState
                    this.updateBoardDisplay()
                }
            } catch (error) {
                console.warn('Failed to load saved game state:', error)
            }
        }
    }

    /**
     * Get statistics from localStorage
     * @returns {{wins: number, losses: number}}
     */
    getStats() {
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
    saveStats(stats) {
        localStorage.setItem('hexapawn-stats', JSON.stringify(stats))
    }

    /**
     * Reset statistics
     */
    resetStats() {
        if (confirm('¿Estás seguro de que quieres reiniciar las estadísticas?')) {
            this.saveStats({ wins: 0, losses: 0 })
            this.updateDisplay()
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HexapawnGame()
})
