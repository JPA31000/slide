class SlidingPuzzle {
    constructor() {
        this.size = 3;
        this.tiles = [];
        this.emptyPos = { row: 2, col: 2 };
        this.moveCount = 0;
        this.currentImage = 'chantier1.jpg';
        this.solved = false;
        this.timerInterval = null; // To store the interval ID for the timer
        this.timeRemaining = 180; // 3 minutes in seconds

        this.initGame();
        this.bindEvents();
    }

    initGame() {
        this.createPuzzle();
        this.renderPuzzle();
        this.updateTimerDisplay(); // Initial display of timer
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

                    piece.style.backgroundImage = `url('./images/${this.currentImage}')`;
                    piece.style.backgroundPosition = `-${tileCol * 100}px -${tileRow * 100}px`;
                    piece.textContent = tileNumber;

                    piece.addEventListener('click', () => this.moveTile(row, col));
                }

                container.appendChild(piece);
            }
        }
    }

    moveTile(row, col) {
        if (this.solved || this.timeRemaining <= 0) return; // Prevent moves if solved or time is up

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

        this.resetTimer(); // Reset and start the timer
        this.startTimer();

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
        this.stopTimer();
        document.getElementById('gameStatus').textContent = 'Félicitations ! Puzzle résolu !';
        document.getElementById('gameStatus').className = 'win-message';
        return true;
    }

    changeImage(imageName) {
        this.currentImage = imageName;
        this.renderPuzzle();
        // When changing image, reset game state including timer
        this.resetGame();
    }

    bindEvents() {
        document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffle());
        document.getElementById('imageSelect').addEventListener('change', (e) => {
            this.changeImage(e.target.value);
        });
        document.getElementById('solveBtn').addEventListener('click', () => this.solve());
    }

    solve() {
        const password = prompt("Veuillez entrer le mot de passe pour résoudre le puzzle :");
        if (password === "123") {
            this.createPuzzle();
            this.renderPuzzle();
            this.solved = true;
            this.stopTimer();
            document.getElementById('gameStatus').textContent = 'Puzzle résolu automatiquement !';
            document.getElementById('gameStatus').className = 'win-message';
        } else {
            alert("Mot de passe incorrect !");
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.gameOver();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    resetTimer() {
        this.stopTimer();
        this.timeRemaining = 180; // Reset to 3 minutes
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(seconds).padStart(2, '0');
        document.getElementById('timeLeft').textContent = `${displayMinutes}:${displaySeconds}`;
    }

    gameOver() {
        this.solved = true; // No more moves allowed
        document.getElementById('gameStatus').textContent = 'Temps écoulé ! Partie terminée.';
        document.getElementById('gameStatus').className = ''; // Remove win message styling if present
    }

    resetGame() {
        this.stopTimer();
        this.resetTimer();
        this.createPuzzle();
        this.renderPuzzle();
        this.moveCount = 0;
        document.getElementById('moveCount').textContent = '0';
        this.solved = false;
        document.getElementById('gameStatus').textContent = 'Mélangez pour commencer';
        document.getElementById('gameStatus').className = '';
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    new SlidingPuzzle();
});
