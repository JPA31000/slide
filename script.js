class SlidingPuzzle {
    constructor() {
        this.size = 3;
        this.tiles = [];
        this.emptyPos = { row: 2, col: 2 };
        this.moveCount = 0;
        this.currentImage = 'chantier1.jpg';
        this.solved = false;
        
        this.initGame();
        this.bindEvents();
    }

    initGame() {
        this.createPuzzle();
        this.renderPuzzle();
    }

    createPuzzle() {
        this.tiles = [];
        for (let row = 0; row < this.size; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.size; col++) {
                if (row === this.size - 1 && col === this.size - 1) {
                    this.tiles[row][col] = 0; // Case vide
                } else {
                    this.tiles[row][col] = row * this.size + col + 1;
                }
            }
        }
    }

    renderPuzzle() {
        const container = document.getElementById('puzzleContainer');
        container.innerHTML = '';

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.dataset.row = row;
                piece.dataset.col = col;

                if (this.tiles[row][col] === 0) {
                    piece.classList.add('empty-piece');
                } else {
                    const tileNumber = this.tiles[row][col];
                    const tileRow = Math.floor((tileNumber - 1) / this.size);
                    const tileCol = (tileNumber - 1) % this.size;
                    
                    piece.style.backgroundImage = `url('${this.currentImage}')`;
                    piece.style.backgroundPosition = `-${tileCol * 100}px -${tileRow * 100}px`;
                    // Remove tile numbers to display only the image
                    piece.textContent = '';
                    
                    piece.addEventListener('click', () => this.moveTile(row, col));
                }

                container.appendChild(piece);
            }
        }
    }

    moveTile(row, col) {
        if (this.solved) return;

        const canMove = this.canMoveTile(row, col);
        if (canMove) {
            // Échanger la tuile avec la case vide
            this.tiles[this.emptyPos.row][this.emptyPos.col] = this.tiles[row][col];
            this.tiles[row][col] = 0;
            
            // Mettre à jour la position de la case vide
            this.emptyPos = { row, col };
            
            this.moveCount++;
            document.getElementById('moveCount').textContent = this.moveCount;
            
            this.renderPuzzle();
            this.checkWin();
        }
    }

    canMoveTile(row, col) {
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);
        
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    shuffle() {
        this.solved = false;
        this.moveCount = 0;
        document.getElementById('moveCount').textContent = '0';
        document.getElementById('gameStatus').textContent = 'Résolvez le puzzle !';
        document.getElementById('gameStatus').className = '';

        // Effectuer des mouvements aléatoires valides
        for (let i = 0; i < 1000; i++) {
            const possibleMoves = this.getPossibleMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.moveTileForShuffle(randomMove.row, randomMove.col);
        }
        
        this.renderPuzzle();
    }

    getPossibleMoves() {
        const moves = [];
        const directions = [
            { row: -1, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: -1 }, { row: 0, col: 1 }
        ];

        for (const dir of directions) {
            const newRow = this.emptyPos.row + dir.row;
            const newCol = this.emptyPos.col + dir.col;
            
            if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
                moves.push({ row: newRow, col: newCol });
            }
        }
        
        return moves;
    }

    moveTileForShuffle(row, col) {
        this.tiles[this.emptyPos.row][this.emptyPos.col] = this.tiles[row][col];
        this.tiles[row][col] = 0;
        this.emptyPos = { row, col };
    }

    checkWin() {
        let expectedValue = 1;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (row === this.size - 1 && col === this.size - 1) {
                    if (this.tiles[row][col] !== 0) return false;
                } else {
                    if (this.tiles[row][col] !== expectedValue) return false;
                    expectedValue++;
                }
            }
        }
        
        this.solved = true;
        document.getElementById('gameStatus').textContent = 'Félicitations ! Puzzle résolu !';
        document.getElementById('gameStatus').className = 'win-message';
        return true;
    }

    changeImage(imageName) {
        this.currentImage = imageName;
        this.renderPuzzle();
    }

    bindEvents() {
        document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffle());
        document.getElementById('imageSelect').addEventListener('change', (e) => {
            this.changeImage(e.target.value);
        });
        document.getElementById('solveBtn').addEventListener('click', () => this.solve());
    }

    solve() {
        this.createPuzzle();
        this.renderPuzzle();
        this.solved = true;
        document.getElementById('gameStatus').textContent = 'Puzzle résolu automatiquement !';
        document.getElementById('gameStatus').className = 'win-message';
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    new SlidingPuzzle();
});
