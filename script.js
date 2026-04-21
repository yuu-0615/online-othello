class OthelloGame {
    constructor() {
        this.board = this.initBoard();
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.init();
    }

    initBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        board[3][3] = 'white';
        board[3][4] = 'black';
        board[4][3] = 'black';
        board[4][4] = 'white';
        return board;
    }

    init() {
        this.render();
        this.updateScores();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('board').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell) {
                const index = Array.from(document.querySelectorAll('.cell')).indexOf(cell);
                const row = Math.floor(index / 8);
                const col = index % 8;
                this.makeMove(row, col);
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.board = this.initBoard();
            this.currentPlayer = 'black';
            this.gameOver = false;
            this.init();
        });

        document.getElementById('passBtn').addEventListener('click', () => {
            this.pass();
        });
    }

    render() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';

                if (this.isValidMove(row, col)) {
                    cell.classList.add('valid');
                }

                if (this.board[row][col]) {
                    const disc = document.createElement('div');
                    disc.className = `disc ${this.board[row][col]}`;
                    disc.textContent = this.board[row][col] === 'black' ? '●' : '○';
                    cell.appendChild(disc);
                }

                boardElement.appendChild(cell);
            }
        }

        this.updateTurnDisplay();
    }

    isValidMove(row, col) {
        if (this.board[row][col] !== null) return false;

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            if (this.hasFlips(row, col, dr, dc)) {
                return true;
            }
        }

        return false;
    }

    hasFlips(row, col, dr, dc) {
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        let r = row + dr;
        let c = col + dc;
        let hasOpponent = false;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (this.board[r][c] === null) return false;
            if (this.board[r][c] === this.currentPlayer) {
                return hasOpponent;
            }
            hasOpponent = true;
            r += dr;
            c += dc;
        }

        return false;
    }

    makeMove(row, col) {
        if (this.gameOver || !this.isValidMove(row, col)) {
            return;
        }

        this.board[row][col] = this.currentPlayer;
        this.flipDiscs(row, col);
        this.switchPlayer();
        this.render();
        this.updateScores();

        if (!this.hasValidMoves()) {
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
            if (!this.hasValidMoves()) {
                this.endGame();
                return;
            }
            document.getElementById('message').textContent = `${this.currentPlayer === 'black' ? '黒' : '白'}がパスしました`;
        }
    }

    flipDiscs(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            const toFlip = this.getFlips(row, col, dr, dc);
            toFlip.forEach(([r, c]) => {
                this.board[r][c] = this.currentPlayer;
            });
        }
    }

    getFlips(row, col, dr, dc) {
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        const flips = [];
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === opponent) {
            flips.push([r, c]);
            r += dr;
            c += dc;
        }

        if (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === this.currentPlayer) {
            return flips;
        }

        return [];
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }

    hasValidMoves() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col)) {
                    return true;
                }
            }
        }
        return false;
    }

    pass() {
        if (!this.hasValidMoves()) {
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
            if (!this.hasValidMoves()) {
                this.endGame();
            } else {
                this.render();
            }
        }
    }

    endGame() {
        this.gameOver = true;
        const scores = this.getScores();
        const winner = scores.black > scores.white ? '黒' : scores.white > scores.black ? '白' : '同点';
        document.getElementById('message').textContent = `ゲーム終了！ ${winner}が勝ちました。黒: ${scores.black}、白: ${scores.white}`;
    }

    getScores() {
        let black = 0, white = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === 'black') black++;
                if (this.board[row][col] === 'white') white++;
            }
        }
        return { black, white };
    }

    updateScores() {
        const scores = this.getScores();
        document.getElementById('player1Score').textContent = scores.black;
        document.getElementById('player2Score').textContent = scores.white;
    }

    updateTurnDisplay() {
        const turnText = this.currentPlayer === 'black' ? '黒' : '白';
        document.getElementById('currentTurn').textContent = turnText;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new OthelloGame();
};