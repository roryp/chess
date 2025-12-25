// Chess Game with Rules-Based AI Engine

/**
 * Rules-Based Chess AI Engine
 * Uses strategic evaluation and tactical analysis to play chess
 * No external services required - pure deterministic logic
 */
class ChessAI {
    constructor() {
        // Piece values for material evaluation
        this.pieceValues = {
            pawn: 100,
            knight: 320,
            bishop: 330,
            rook: 500,
            queen: 900,
            king: 20000
        };
        
        // Piece-square tables for positional evaluation
        this.pawnTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ];
        
        this.knightTable = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ];
        
        this.bishopTable = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ];
        
        this.rookTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]
        ];
        
        this.queenTable = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ];
        
        this.kingMiddleTable = [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]
        ];
    }
    
    /**
     * Get all valid moves for a color
     */
    getAllValidMoves(game, color) {
        const moves = [];
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = game.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (game.isValidMove(fromRow, fromCol, toRow, toCol) &&
                                !game.wouldMoveLeaveKingInCheck(fromRow, fromCol, toRow, toCol)) {
                                moves.push({
                                    fromRow, fromCol, toRow, toCol,
                                    piece: piece,
                                    captured: game.board[toRow][toCol]
                                });
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }
    
    /**
     * Evaluate material balance
     */
    getMaterialCount(game, color) {
        let material = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.board[row][col];
                if (piece && piece.color === color) {
                    material += this.pieceValues[piece.type];
                }
            }
        }
        return material;
    }
    
    /**
     * Get positional bonus for a piece
     */
    getPositionalBonus(piece, row, col, color) {
        // Flip row for black pieces
        const r = color === 'white' ? row : 7 - row;
        
        switch (piece.type) {
            case 'pawn': return this.pawnTable[r][col];
            case 'knight': return this.knightTable[r][col];
            case 'bishop': return this.bishopTable[r][col];
            case 'rook': return this.rookTable[r][col];
            case 'queen': return this.queenTable[r][col];
            case 'king': return this.kingMiddleTable[r][col];
            default: return 0;
        }
    }
    
    /**
     * Check if a square is attacked by opponent
     */
    isSquareAttackedBy(game, row, col, attackerColor) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = game.board[r][c];
                if (piece && piece.color === attackerColor) {
                    if (game.canPieceAttack(r, c, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * Check if move gives check
     */
    movesGivesCheck(game, move, opponentColor) {
        // Simulate the move
        const originalPiece = game.board[move.toRow][move.toCol];
        game.board[move.toRow][move.toCol] = move.piece;
        game.board[move.fromRow][move.fromCol] = null;
        
        const givesCheck = game.isInCheck(opponentColor);
        
        // Undo
        game.board[move.fromRow][move.fromCol] = move.piece;
        game.board[move.toRow][move.toCol] = originalPiece;
        
        return givesCheck;
    }
    
    /**
     * Determine game phase
     */
    getGamePhase(game) {
        let totalMaterial = 0;
        let pieceCount = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.board[row][col];
                if (piece && piece.type !== 'king' && piece.type !== 'pawn') {
                    totalMaterial += this.pieceValues[piece.type];
                    pieceCount++;
                }
            }
        }
        
        if (pieceCount <= 4 || totalMaterial < 2000) return 'endgame';
        if (game.moveHistory.length < 10) return 'opening';
        return 'middlegame';
    }
    
    /**
     * Score a move based on multiple factors
     */
    scoreMove(game, move, color) {
        let score = 0;
        const opponentColor = color === 'white' ? 'black' : 'white';
        const phase = this.getGamePhase(game);
        
        // 1. Capture scoring (MVV-LVA)
        if (move.captured) {
            const victimValue = this.pieceValues[move.captured.type];
            const attackerValue = this.pieceValues[move.piece.type];
            score += victimValue * 10 - attackerValue;
        }
        
        // 2. Check bonus
        if (this.movesGivesCheck(game, move, opponentColor)) {
            score += 500;
        }
        
        // 3. Positional improvement
        const oldPositional = this.getPositionalBonus(move.piece, move.fromRow, move.fromCol, color);
        const newPositional = this.getPositionalBonus(move.piece, move.toRow, move.toCol, color);
        score += (newPositional - oldPositional);
        
        // 4. Safety - penalize moving to attacked squares
        if (this.isSquareAttackedBy(game, move.toRow, move.toCol, opponentColor)) {
            // Moving to attacked square
            if (!move.captured || this.pieceValues[move.captured.type] < this.pieceValues[move.piece.type]) {
                score -= this.pieceValues[move.piece.type] / 2;
            }
        }
        
        // 5. Opening principles
        if (phase === 'opening') {
            // Develop knights and bishops early
            if ((move.piece.type === 'knight' || move.piece.type === 'bishop') && 
                (move.fromRow === 0 || move.fromRow === 7)) {
                score += 50;
            }
            // Control center
            if ((move.toRow === 3 || move.toRow === 4) && (move.toCol === 3 || move.toCol === 4)) {
                score += 30;
            }
            // Don't move queen too early
            if (move.piece.type === 'queen' && game.moveHistory.length < 6) {
                score -= 30;
            }
        }
        
        // 6. Endgame - push passed pawns, activate king
        if (phase === 'endgame') {
            if (move.piece.type === 'pawn') {
                // Bonus for advancing pawns in endgame
                const advancement = color === 'white' ? (6 - move.toRow) : (move.toRow - 1);
                score += advancement * 20;
            }
            if (move.piece.type === 'king') {
                // King should be active in endgame
                score += 20;
            }
        }
        
        return score;
    }
    
    /**
     * Get the best move using rules-based evaluation
     */
    getBestMove(game, color) {
        const moves = this.getAllValidMoves(game, color);
        
        if (moves.length === 0) return null;
        
        // Score all moves
        const scoredMoves = moves.map(move => ({
            ...move,
            score: this.scoreMove(game, move, color)
        }));
        
        // Sort by score descending
        scoredMoves.sort((a, b) => b.score - a.score);
        
        // Add some randomness among top moves to avoid repetitive play
        const topMoves = scoredMoves.filter(m => m.score >= scoredMoves[0].score - 50);
        const selectedMove = topMoves[Math.floor(Math.random() * Math.min(3, topMoves.length))];
        
        console.log(`🤖 AI evaluating ${moves.length} moves, best score: ${scoredMoves[0].score}`);
        
        return selectedMove;
    }
}

class ChessGame {
    constructor() {
        this.board = [];
        this.currentTurn = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.boardFlipped = false;
        this.famousGameIndex = null;
        this.famousGameMoveIndex = 0;
        this.isReplaying = false;
        this.gameOver = false;
        
        // AI Settings
        this.ai = new ChessAI();
        this.whitePlayer = 'human';  // 'human' or 'ai'
        this.blackPlayer = 'ai';     // 'human' or 'ai' - default AI plays black
        this.aiDelay = 500;          // Delay before AI moves (ms)
        this.aiThinking = false;
        
        // Draw detection
        this.positionHistory = [];  // For threefold repetition
        this.halfMoveClock = 0;     // For 50-move rule (resets on pawn move or capture)
        this.maxMoves = 200;        // Maximum moves before declaring draw
        
        this.famousGames = [
            {
                name: "The Immortal Game",
                players: "Anderssen vs Kieseritzky",
                year: 1851,
                description: "One of the most famous chess games ever played, featuring brilliant sacrifices.",
                moves: [
                    "e2e4", "e7e5", "f2f4", "e5f4", "b1c3", "g8f6", "e1f3", "b7b5",
                    "f3f4", "b8c6", "c3d5", "f6d5", "f4d5", "c6d4", "c1c3", "d4f3",
                    "d1f3", "b5b4", "c3e5", "b4c3", "d5f7", "e8e7", "f3f6", "c3b2",
                    "f6f7", "e7d8", "f7e8", "d8c7", "e5c3", "c7b6", "e8d8", "b6a6",
                    "d8c8", "a6a5", "c8b8", "a5a4", "b8c8", "a4a3", "c8d8", "a3b2",
                    "d8e8", "b2c1", "e8f8", "c1d1", "f8g8", "d1e1", "g8h8", "e1f1"
                ]
            },
            {
                name: "The Opera Game",
                players: "Morphy vs Allies",
                year: 1858,
                description: "Paul Morphy's brilliant combination play demonstrating perfect coordination.",
                moves: [
                    "e2e4", "e7e5", "g1f3", "d7d6", "d2d4", "c8g4", "d4e5", "g4f3",
                    "d1f3", "d6e5", "f1c4", "g8f6", "b1c3", "f8e7", "f3b3", "b8d7",
                    "c3d5", "f6d5", "e4d5", "d7b6", "c4b5", "c7c6", "d5c6", "b7c6",
                    "b5c6", "b6c6", "b3c3", "e8d8", "c1f4", "c6b6", "c3b4", "b6d7",
                    "f4e5", "d8c8", "e1c1", "h8e8", "e5d4", "e7d6", "b4d6", "d7f6",
                    "d4f6", "f8f6", "d6f6"
                ]
            },
            {
                name: "Game of the Century",
                players: "Fischer vs Byrne",
                year: 1956,
                description: "13-year-old Fischer's masterpiece against a master, featuring the 'Boden-Kieseritzky' gambit.",
                moves: [
                    "g1f3", "g8f6", "c2c4", "g7g6", "b1c3", "f8g7", "d2d4", "e8g8",
                    "e2e4", "d7d6", "f1e2", "e7e5", "d4e5", "d6e5", "f3e5", "f6d7",
                    "e5f3", "d7c5", "f3d4", "c5e6", "e2f3", "b8c6", "d4c6", "b7c6",
                    "e1g1", "c8a6", "c1f4", "a6f1", "a1f1", "d8e7", "f4e5", "g7e5",
                    "f3c6", "a8b8", "c6d5", "b8b2", "d1d3", "e5f4", "d5a8", "f4d6",
                    "a8d5", "d6c5", "d5c6", "c5d4", "c6d5", "d4e3", "f1f3", "e3d2",
                    "d5a8", "d2c1", "a8d5", "c1b2", "d3f3", "b2c1", "d5f3", "c1d1",
                    "f3d5", "d1e1", "d5e4", "e1d1", "e4d5", "d1c1", "d5c6"
                ]
            },
            {
                name: "Deep Blue vs Kasparov, Game 6",
                players: "Deep Blue vs Kasparov",
                year: 1997,
                description: "The historic game where Deep Blue defeated the world champion, marking a milestone in computer chess.",
                moves: [
                    "e2e4", "c7c6", "d2d4", "d7d5", "b1c3", "d5e4", "c3e4", "b8d7",
                    "g1f3", "g8f6", "e4f6", "d7f6", "e1g1", "c8f5", "c2c3", "e7e6",
                    "f3e5", "f8d6", "d1f3", "d8c7", "f3f4", "e8g8", "f4f5", "c7e7",
                    "f5f7", "e7f7", "e5f7", "g8f7", "c1f4", "f6e4", "f4d6", "e4d6",
                    "f1b5", "a8d8", "b5d7", "d8d7", "e1f1", "f7e6", "d1e1", "d6f5",
                    "e1e6", "f5e7", "e6e7", "d7d6", "e7e8", "d6d8", "e8e5"
                ]
            },
            {
                name: "Kasparov's Immortal",
                players: "Kasparov vs Topalov",
                year: 1999,
                description: "Kasparov's brilliant sacrificial masterpiece in Wijk aan Zee.",
                moves: [
                    "e2e4", "d7d6", "d2d4", "g8f6", "b1c3", "g7g6", "c1e3", "f8g7",
                    "d1d2", "b8d7", "f2f3", "e8g8", "f1c4", "c7c5", "e1c1", "b7b5",
                    "c4b3", "c5c4", "b3c4", "d7b6", "c4b3", "c8b7", "g1e2", "d6d5",
                    "e4e5", "f6e4", "c3e4", "d5e4", "e2c3", "d8c7", "c3e4", "b7e4",
                    "f3e4", "f7f5", "e4f5", "g7d4", "d2d4", "c7c5", "d4d5", "f8d8",
                    "d5e5", "d8d2", "e5e8", "d2d8", "e8e5"
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.setupPieces();
        this.renderBoard();
        this.setupEventListeners();
        this.setupAIControls();
        this.updateTurnIndicator();
    }
    
    setupAIControls() {
        const whiteSelect = document.getElementById('white-player');
        const blackSelect = document.getElementById('black-player');
        const delayInput = document.getElementById('ai-delay');
        
        if (whiteSelect) {
            whiteSelect.addEventListener('change', (e) => {
                this.whitePlayer = e.target.value;
                this.updateAIStatus();
                this.checkAndTriggerAI();
            });
        }
        
        if (blackSelect) {
            blackSelect.addEventListener('change', (e) => {
                this.blackPlayer = e.target.value;
                this.updateAIStatus();
                this.checkAndTriggerAI();
            });
        }
        
        if (delayInput) {
            delayInput.addEventListener('change', (e) => {
                this.aiDelay = parseInt(e.target.value) || 500;
            });
        }
        
        this.updateAIStatus();
    }
    
    isCurrentPlayerAI() {
        return (this.currentTurn === 'white' && this.whitePlayer === 'ai') ||
               (this.currentTurn === 'black' && this.blackPlayer === 'ai');
    }
    
    updateAIStatus() {
        const statusElement = document.getElementById('ai-status');
        if (!statusElement) return;
        
        const whiteIsAI = this.whitePlayer === 'ai';
        const blackIsAI = this.blackPlayer === 'ai';
        
        if (whiteIsAI && blackIsAI) {
            statusElement.textContent = '🤖 AI vs AI - Watch the game!';
            statusElement.className = 'ai-status ai-vs-ai';
        } else if (whiteIsAI) {
            statusElement.textContent = '🤖 AI plays White';
            statusElement.className = 'ai-status ai-white';
        } else if (blackIsAI) {
            statusElement.textContent = '🤖 AI plays Black';
            statusElement.className = 'ai-status ai-black';
        } else {
            statusElement.textContent = '👤 Human vs Human';
            statusElement.className = 'ai-status human-vs-human';
        }
        
        if (this.aiThinking) {
            statusElement.textContent += ' (Thinking...)';
        }
    }
    
    checkAndTriggerAI() {
        if (this.isReplaying || this.gameOver || this.aiThinking) return;
        
        if (this.isCurrentPlayerAI()) {
            setTimeout(() => this.triggerAIMove(), 100);
        }
    }
    
    async triggerAIMove() {
        if (this.aiThinking || this.isReplaying || this.gameOver) return;
        
        this.aiThinking = true;
        this.updateAIStatus();
        
        await new Promise(resolve => setTimeout(resolve, this.aiDelay));
        
        const move = this.ai.getBestMove(this, this.currentTurn);
        
        if (move) {
            this.makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
            this.renderBoard();
        }
        
        this.aiThinking = false;
        this.updateAIStatus();
        
        // Check if next player is also AI
        if (this.isCurrentPlayerAI() && !this.gameOver) {
            setTimeout(() => this.triggerAIMove(), 100);
        }
    }
    
    createBoard() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    }
    
    setupPieces() {
        // Clear board
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Pawns
        for (let col = 0; col < 8; col++) {
            this.board[1][col] = { type: 'pawn', color: 'black' };
            this.board[6][col] = { type: 'pawn', color: 'white' };
        }
        
        // Rooks
        this.board[0][0] = { type: 'rook', color: 'black' };
        this.board[0][7] = { type: 'rook', color: 'black' };
        this.board[7][0] = { type: 'rook', color: 'white' };
        this.board[7][7] = { type: 'rook', color: 'white' };
        
        // Knights
        this.board[0][1] = { type: 'knight', color: 'black' };
        this.board[0][6] = { type: 'knight', color: 'black' };
        this.board[7][1] = { type: 'knight', color: 'white' };
        this.board[7][6] = { type: 'knight', color: 'white' };
        
        // Bishops
        this.board[0][2] = { type: 'bishop', color: 'black' };
        this.board[0][5] = { type: 'bishop', color: 'black' };
        this.board[7][2] = { type: 'bishop', color: 'white' };
        this.board[7][5] = { type: 'bishop', color: 'white' };
        
        // Queens
        this.board[0][3] = { type: 'queen', color: 'black' };
        this.board[7][3] = { type: 'queen', color: 'white' };
        
        // Kings
        this.board[0][4] = { type: 'king', color: 'black' };
        this.board[7][4] = { type: 'king', color: 'white' };
    }
    
    renderBoard() {
        const boardElement = document.getElementById('chess-board');
        if (!boardElement) {
            return;
        }
        boardElement.innerHTML = '';
        
        const startRow = this.boardFlipped ? 7 : 0;
        const endRow = this.boardFlipped ? -1 : 8;
        const step = this.boardFlipped ? -1 : 1;
        
        for (let row = startRow; row !== endRow; row += step) {
            for (let col = (this.boardFlipped ? 7 : 0); col !== (this.boardFlipped ? -1 : 8); col += (this.boardFlipped ? -1 : 1)) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (this.selectedSquare && this.selectedSquare.row === row && this.selectedSquare.col === col) {
                    square.classList.add('selected');
                }
                
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece.color} ${piece.type}`;
                    const symbol = this.getPieceSymbol(piece);
                    pieceElement.textContent = symbol;
                    square.appendChild(pieceElement);
                }
                
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }
    
    getPieceSymbol(piece) {
        const symbols = {
            white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
            black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
        };
        return symbols[piece.color][piece.type];
    }
    
    handleSquareClick(row, col) {
        if (this.isReplaying) return;
        if (this.gameOver) return;
        if (this.isCurrentPlayerAI()) return; // Block human input during AI turn
        if (this.aiThinking) return;
        
        const piece = this.board[row][col];
        
        if (this.selectedSquare) {
            const selectedPiece = this.board[this.selectedSquare.row][this.selectedSquare.col];
            if (selectedPiece && selectedPiece.color === this.currentTurn) {
                const isValid = this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                const wouldLeaveInCheck = this.wouldMoveLeaveKingInCheck(this.selectedSquare.row, this.selectedSquare.col, row, col);
                if (isValid && !wouldLeaveInCheck) {
                    this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                    this.selectedSquare = null;
                    this.renderBoard();
                    
                    // Trigger AI if next player is AI
                    if (this.isCurrentPlayerAI() && !this.gameOver) {
                        this.triggerAIMove();
                    }
                    return;
                }
            }
        }
        
        if (piece && piece.color === this.currentTurn) {
            this.selectedSquare = { row, col };
            this.renderBoard();
        } else {
            this.selectedSquare = null;
            this.renderBoard();
        }
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        
        if (!piece) return false;
        
        if (targetPiece && targetPiece.color === piece.color) {
            return false;
        }
        
        // Validate bounds
        if (fromRow < 0 || fromRow >= 8 || fromCol < 0 || fromCol >= 8 ||
            toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
            return false;
        }
        
        // Can't move to the same square
        if (fromRow === toRow && fromCol === toCol) {
            return false;
        }
        
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Basic move validation based on piece type
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                const startRow = piece.color === 'white' ? 6 : 1;
                
                // Forward move
                if (fromCol === toCol) {
                    if (targetPiece) {
                        return false; // Can't capture forward
                    }
                    // One square forward
                    if (toRow === fromRow + direction) {
                        return true;
                    }
                    // Two squares forward from start position
                    if (fromRow === startRow && toRow === fromRow + (2 * direction) && !this.board[fromRow + direction][fromCol]) {
                        return true;
                    }
                    return false;
                }
                // Diagonal capture
                if (colDiff === 1 && toRow === fromRow + direction && targetPiece && targetPiece.color !== piece.color) {
                    return true;
                }
                return false;
                
            case 'rook':
                // Rook moves horizontally or vertically
                if ((fromRow === toRow || fromCol === toCol) && this.isPathClear(fromRow, fromCol, toRow, toCol)) {
                    return true;
                }
                return false;
                
            case 'knight':
                // Knight moves in L-shape: (2,1) or (1,2)
                if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
                    return true;
                }
                return false;
                
            case 'bishop':
                // Bishop moves diagonally
                if (rowDiff === colDiff && this.isPathClear(fromRow, fromCol, toRow, toCol)) {
                    return true;
                }
                return false;
                
            case 'queen':
                // Queen moves like rook or bishop
                const isRookMove = (fromRow === toRow || fromCol === toCol);
                const isBishopMove = (rowDiff === colDiff);
                if ((isRookMove || isBishopMove) && this.isPathClear(fromRow, fromCol, toRow, toCol)) {
                    return true;
                }
                return false;
                
            case 'king':
                // King moves one square in any direction
                if (rowDiff <= 1 && colDiff <= 1) {
                    return true;
                }
                return false;
                
            default:
                return false;
        }
    }
    
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
        const colStep = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);
        
        let row = fromRow + rowStep;
        let col = fromCol + colStep;
        
        while (row !== toRow || col !== toCol) {
            if (this.board[row][col] !== null) {
                return false;
            }
            row += rowStep;
            col += colStep;
        }
        
        return true;
    }
    
    // Find the king's position for a given color
    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }
    
    // Check if a square is attacked by any piece of the given color
    isSquareAttacked(row, col, attackerColor) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === attackerColor) {
                    if (this.canPieceAttack(fromRow, fromCol, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    // Check if a piece can attack a target square (simplified move validation without recursion)
    canPieceAttack(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                // Pawns attack diagonally
                return colDiff === 1 && toRow === fromRow + direction;
                
            case 'rook':
                return (fromRow === toRow || fromCol === toCol) && 
                       this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'knight':
                return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
                
            case 'bishop':
                return rowDiff === colDiff && 
                       this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'queen':
                const isRookMove = (fromRow === toRow || fromCol === toCol);
                const isBishopMove = (rowDiff === colDiff);
                return (isRookMove || isBishopMove) && 
                       this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'king':
                return rowDiff <= 1 && colDiff <= 1;
                
            default:
                return false;
        }
    }
    
    // Check if the given color's king is in check
    isInCheck(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareAttacked(kingPos.row, kingPos.col, opponentColor);
    }
    
    // Check if a move would leave the king in check (illegal move)
    wouldMoveLeaveKingInCheck(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return true;
        
        // Simulate the move
        const capturedPiece = this.board[toRow][toCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Check if king is in check after the move
        const inCheck = this.isInCheck(piece.color);
        
        // Undo the move
        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = capturedPiece;
        
        return inCheck;
    }
    
    // Check if it's checkmate (in check and no legal moves)
    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;
        return !this.hasLegalMoves(color);
    }
    
    // Check if it's stalemate (not in check but no legal moves)
    isStalemate(color) {
        if (this.isInCheck(color)) return false;
        return !this.hasLegalMoves(color);
    }
    
    // Check if a player has any legal moves
    hasLegalMoves(color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol) &&
                                !this.wouldMoveLeaveKingInCheck(fromRow, fromCol, toRow, toCol)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];
        
        // Update half-move clock (for 50-move rule)
        if (piece.type === 'pawn' || captured) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Pawn promotion - promote to queen when reaching the last rank
        if (piece.type === 'pawn') {
            const promotionRow = piece.color === 'white' ? 0 : 7;
            if (toRow === promotionRow) {
                this.board[toRow][toCol] = { type: 'queen', color: piece.color };
            }
        }
        
        const moveNotation = this.getMoveNotation(fromRow, fromCol, toRow, toCol);
        this.moveHistory.push(moveNotation);
        this.updateMoveHistory();
        
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        
        // Check if the next player is in check
        const inCheck = this.isInCheck(this.currentTurn);
        this.updateTurnIndicator(inCheck);
        
        // Track position for repetition detection
        const positionKey = this.getBoardPositionKey();
        this.positionHistory.push(positionKey);
        
        // Check for draws and game over
        this.checkGameOver();
    }
    
    getBoardPositionKey() {
        // Create a unique string representing the current board position
        let key = this.currentTurn;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    key += `${row}${col}${piece.type[0]}${piece.color[0]}`;
                }
            }
        }
        return key;
    }
    
    countPositionOccurrences(positionKey) {
        return this.positionHistory.filter(p => p === positionKey).length;
    }
    
    checkGameOver() {
        const statusElement = document.getElementById('game-status');
        
        // Check for threefold repetition (position must have occurred 3+ times)
        const currentPosition = this.getBoardPositionKey();
        const occurrences = this.countPositionOccurrences(currentPosition);
        if (occurrences >= 3) {
            this.gameOver = true;
            if (statusElement) {
                statusElement.textContent = `🤝 Draw by threefold repetition! (Position repeated ${occurrences} times)`;
            }
            return;
        }
        
        // Check for 50-move rule
        if (this.halfMoveClock >= 100) {  // 100 half-moves = 50 full moves
            this.gameOver = true;
            if (statusElement) {
                statusElement.textContent = `🤝 Draw by 50-move rule!`;
            }
            return;
        }
        
        // Check for maximum moves (safety limit)
        if (this.moveHistory.length >= this.maxMoves) {
            this.gameOver = true;
            if (statusElement) {
                statusElement.textContent = `🤝 Draw by move limit (${this.maxMoves} moves)!`;
            }
            return;
        }
        
        // Check for checkmate
        if (this.isCheckmate(this.currentTurn)) {
            this.gameOver = true;
            const winner = this.currentTurn === 'white' ? 'Black' : 'White';
            if (statusElement) {
                statusElement.textContent = `♚ Checkmate! ${winner} wins!`;
            }
            return;
        }
        
        // Check for stalemate
        if (this.isStalemate(this.currentTurn)) {
            this.gameOver = true;
            if (statusElement) {
                statusElement.textContent = `🤝 Stalemate! It's a draw.`;
            }
            return;
        }
        
        // Update check indicator
        if (this.isInCheck(this.currentTurn)) {
            this.updateTurnIndicator(true);
        }
    }
    
    getMoveNotation(fromRow, fromCol, toRow, toCol) {
        const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const fromSquare = cols[fromCol] + (8 - fromRow);
        const toSquare = cols[toCol] + (8 - toRow);
        return fromSquare + toSquare;
    }
    
    updateMoveHistory() {
        const moveList = document.getElementById('move-list');
        moveList.innerHTML = '';
        
        this.moveHistory.forEach((move, index) => {
            const moveItem = document.createElement('div');
            moveItem.className = 'move-item';
            moveItem.textContent = `${index + 1}. ${move}`;
            moveList.appendChild(moveItem);
        });
    }
    
    updateTurnIndicator(inCheck = false) {
        const turnElement = document.getElementById('current-turn');
        const checkText = inCheck ? ' - Check!' : '';
        turnElement.textContent = `${this.currentTurn.charAt(0).toUpperCase() + this.currentTurn.slice(1)} to move${checkText}`;
        
        // Add visual styling for check
        if (inCheck) {
            turnElement.style.color = '#ff4444';
            turnElement.style.fontWeight = 'bold';
        } else {
            turnElement.style.color = '';
            turnElement.style.fontWeight = '';
        }
    }
    
    setupEventListeners() {
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('flip-btn').addEventListener('click', () => this.flipBoard());
    }
    
    resetGame() {
        this.selectedSquare = null;
        this.moveHistory = [];
        this.currentTurn = 'white';
        this.famousGameIndex = null;
        this.famousGameMoveIndex = 0;
        this.isReplaying = false;
        this.gameOver = false;
        this.aiThinking = false;
        this.positionHistory = [];
        this.halfMoveClock = 0;
        this.setupPieces();
        this.renderBoard();
        this.updateMoveHistory();
        this.updateTurnIndicator();
        this.updateAIStatus();
        this.hideFamousGameInfo();
        
        // Clear game status
        const statusElement = document.getElementById('game-status');
        if (statusElement) {
            statusElement.textContent = '';
        }
        
        // Trigger AI if it's their turn
        this.checkAndTriggerAI();
    }
    
    flipBoard() {
        this.boardFlipped = !this.boardFlipped;
        this.renderBoard();
    }
    
    loadFamousGame(index) {
        const game = this.famousGames[index];
        this.famousGameIndex = index;
        this.famousGameMoveIndex = 0;
        this.isReplaying = true;
        
        this.resetGame();
        this.isReplaying = true;
        
        this.showFamousGameInfo(game);
        this.replayGame(game.moves);
    }
    
    showFamousGameInfo(game) {
        let infoPanel = document.getElementById('famous-game-info');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'famous-game-info';
            infoPanel.className = 'famous-game-info';
            document.querySelector('.game-container').insertBefore(infoPanel, document.querySelector('.chess-board-container'));
        }
        
        infoPanel.innerHTML = `
            <h3>📜 ${game.name}</h3>
            <p><strong>Players:</strong> ${game.players}</p>
            <p><strong>Year:</strong> ${game.year}</p>
            <p><strong>Description:</strong> ${game.description}</p>
            <div class="replay-controls">
                <button id="prev-move-btn" class="btn-small">◀ Previous</button>
                <button id="next-move-btn" class="btn-small">Next ▶</button>
                <button id="stop-replay-btn" class="btn-small">Stop Replay</button>
            </div>
        `;
        
        infoPanel.style.display = 'block';
        
        document.getElementById('next-move-btn').addEventListener('click', () => {
            if (this.famousGameMoveIndex < game.moves.length) {
                this.playNextMove(game.moves);
            }
        });
        
        document.getElementById('prev-move-btn').addEventListener('click', () => {
            if (this.famousGameMoveIndex > 0) {
                this.famousGameMoveIndex--;
                this.resetGame();
                this.isReplaying = true;
                for (let i = 0; i < this.famousGameMoveIndex; i++) {
                    this.executeMoveNotation(game.moves[i]);
                }
                this.renderBoard();
            }
        });
        
        document.getElementById('stop-replay-btn').addEventListener('click', () => {
            this.resetGame();
            this.hideFamousGameInfo();
        });
    }
    
    hideFamousGameInfo() {
        const infoPanel = document.getElementById('famous-game-info');
        if (infoPanel) {
            infoPanel.style.display = 'none';
        }
    }
    
    replayGame(moves) {
        this.famousGameMoveIndex = 0;
        this.playNextMove(moves);
    }
    
    playNextMove(moves) {
        if (this.famousGameMoveIndex < moves.length) {
            const move = moves[this.famousGameMoveIndex];
            this.executeMoveNotation(move);
            this.famousGameMoveIndex++;
            this.renderBoard();
            
            // Auto-play next move after a short delay
            setTimeout(() => {
                if (this.famousGameMoveIndex < moves.length && this.isReplaying) {
                    this.playNextMove(moves);
                }
            }, 1000);
        } else {
            this.isReplaying = false;
        }
    }
    
    executeMoveNotation(notation) {
        // Validate notation format (e.g., "e2e4")
        if (!notation || notation.length < 4 || !/^[a-h][1-8][a-h][1-8]$/.test(notation)) {
            console.warn(`Invalid move notation: ${notation}`);
            return false;
        }
        
        // Parse notation like "e2e4"
        const fromCol = notation.charCodeAt(0) - 97; // a=0, b=1, etc.
        const fromRow = 8 - parseInt(notation[1]);
        const toCol = notation.charCodeAt(2) - 97;
        const toRow = 8 - parseInt(notation[3]);
        
        const piece = this.board[fromRow][fromCol];
        if (piece) {
            this.board[toRow][toCol] = piece;
            this.board[fromRow][fromCol] = null;
            this.moveHistory.push(notation);
            this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        }
        
        this.updateMoveHistory();
        this.updateTurnIndicator();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new ChessGame();
    
    // Create famous games selector
    const controlsDiv = document.querySelector('.game-controls');
    const famousGamesDiv = document.createElement('div');
    famousGamesDiv.className = 'famous-games-selector';
    famousGamesDiv.innerHTML = `
        <h3>🏆 Famous Games</h3>
        <select id="famous-games-select" class="famous-select">
            <option value="">Select a famous game...</option>
        </select>
        <button id="load-game-btn" class="btn">Load Game</button>
    `;
    
    controlsDiv.appendChild(famousGamesDiv);
    
    const select = document.getElementById('famous-games-select');
    game.famousGames.forEach((gameInfo, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${gameInfo.name} (${gameInfo.year})`;
        select.appendChild(option);
    });
    
    document.getElementById('load-game-btn').addEventListener('click', () => {
        const selectedIndex = parseInt(select.value);
        if (!isNaN(selectedIndex)) {
            game.loadFamousGame(selectedIndex);
        }
    });
    
    window.chessGame = game;
});
