// Chess Game with Famous Game Recaps

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
                description: "The historic game where Deep Blue defeated the world champion, marking a milestone in AI.",
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
        this.updateTurnIndicator();
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
                    pieceElement.textContent = this.getPieceSymbol(piece);
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
        
        const piece = this.board[row][col];
        
        if (this.selectedSquare) {
            const selectedPiece = this.board[this.selectedSquare.row][this.selectedSquare.col];
            if (selectedPiece && selectedPiece.color === this.currentTurn) {
                if (this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
                    this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                    this.selectedSquare = null;
                    this.renderBoard();
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
        
        if (targetPiece && targetPiece.color === piece.color) {
            return false;
        }
        
        // Basic move validation (simplified)
        return true;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        const moveNotation = this.getMoveNotation(fromRow, fromCol, toRow, toCol);
        this.moveHistory.push(moveNotation);
        this.updateMoveHistory();
        
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        this.updateTurnIndicator();
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
    
    updateTurnIndicator() {
        const turnElement = document.getElementById('current-turn');
        turnElement.textContent = `${this.currentTurn.charAt(0).toUpperCase() + this.currentTurn.slice(1)} to move`;
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
        this.setupPieces();
        this.renderBoard();
        this.updateMoveHistory();
        this.updateTurnIndicator();
        this.hideFamousGameInfo();
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
