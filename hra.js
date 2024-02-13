document.addEventListener('DOMContentLoaded', () => {
    // Function to check if the user is logged in
    function isLoggedIn() {
        return localStorage.getItem('2048-jmeno') !== null;
    }

    // Function to redirect to login page
    function redirectToLogin() {
        window.location.href = 'prihlaseni.html';
    }

    // Check if the user is logged in
    if (!isLoggedIn()) {
        redirectToLogin();
    }
});


// hra.js
class Game {
    constructor() {
        // Konstruktor inicializuje vlastnosti hry a nastavuje počáteční stav.
        this.gridElement = document.querySelector('.grid'); // Odkaz na mřížku hry v HTML
        this.size = 4; // Velikost herní mřížky (4x4)
        this.board = []; // Reprezentuje herní mřížku s hodnotami
        this.currentScore = 0; // Aktuální skóre hráče
        this.currentScoreElem = document.getElementById('current-score'); // Zobrazení aktuálního skóre
        this.highScoreElem = document.getElementById('high-score'); // Zobrazení nejvyššího skóre
        this.gameOverElem = document.getElementById('game-over'); // Prvek pro zobrazení, když je hra u konce

        // Inicializace hry, kontrola konce hry a nastavení posluchačů událostí.
        this.initializeGame();
        this.checkGameOver();
        this.setupEventListeners();
    }

    // Aktualizuje skóre a nejvyšší skóre na základě zadané hodnoty.
    updateScore(value) {
        this.currentScore += value;
        this.currentScoreElem.textContent = this.currentScore;

        // Uloží skóre hráče do localStorage
        const loggedInUser = localStorage.getItem('2048-jmeno');
        localStorage.setItem(`2048-score-${loggedInUser}`, this.currentScore);

        // Aktualizuje nejvyšší skóre, pokud aktuální skóre překročí nejvyšší dosažené skóre.
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.highScoreElem.textContent = this.highScore;
            localStorage.setItem('2048-highScore', this.highScore);
        }
    }


    // Restartuje hru tím, že vynuluje skóre a přesměruje na 'prihlaseni.html'.
    restartGame() {
        const finalScore = this.currentScore;
        this.currentScore = 0;
        this.currentScoreElem.textContent = '0';
        this.gameOverElem.style.display = 'none';
        window.alert(`Your final score: ${finalScore}`);
        window.location.href = 'prihlaseni.html';
    }

    // Inicializuje hru nastavením herního pole, umístěním počátečních náhodných hodnot,
    // vykreslením herního pole a aktualizací skóre.
    initializeGame() {
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.placeRandom();
        this.placeRandom();
        this.renderBoard();
        this.currentScore = 0; // Přidaný řádek pro resetování aktuálního skóre
        this.currentScoreElem.textContent = '0';
        this.highScore = localStorage.getItem('2048-highScore') || 0; // Přidaný řádek pro získání nejvyššího skóre z localStorage
        this.highScoreElem.textContent = this.highScore; // Přidaný řádek pro aktualizaci highScoreElem
        console.log(this.board);
    }
    
    // Vykresluje herní pole dynamicky vytvářením HTML elementů pro každou buňku.
    renderBoard() {
        this.gridElement.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.gridElement.appendChild(cell);
                this.updateCell(cell, this.board[i][j]);
            }
        }
    }

    // Aktualizuje HTML reprezentaci buňky s danou hodnotou.
    updateCell(cell, value) {
        cell.textContent = value !== 0 ? value : '';
        cell.dataset.value = value;
        cell.className = 'cell';
        if (value !== 0) {
            cell.classList.add(`value-${value}`);
        }
    }

    // Umístí náhodnou hodnotu (2 nebo 4) do prázdné buňky herního pole.
    placeRandom() {
        const available = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    available.push({ x: i, y: j });
                }
            }
        }

        if (available.length > 0) {
            const randomCell = available[Math.floor(Math.random() * available.length)];
            this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Zpracuje tah hráče ve zadaném směru (šipky).
    move(direction) {
        let hasChanged = false;
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let j = 0; j < this.size; j++) {
                const column = [...Array(this.size)].map((_, i) => this.board[i][j]);
                const newColumn = this.transform(column, direction === 'ArrowUp');
                for (let i = 0; i < this.size; i++) {
                    if (this.board[i][j] !== newColumn[i]) {
                        hasChanged = true;
                        this.board[i][j] = newColumn[i];
                    }
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let i = 0; i < this.size; i++) {
                const row = this.board[i];
                const newRow = this.transform(row, direction === 'ArrowLeft');
                if (row.join(',') !== newRow.join(',')) {
                    hasChanged = true;
                    this.board[i] = newRow;
                }
            }
        }
        if (hasChanged) {
            this.placeRandom();
            this.renderBoard();
            this.checkGameOver();
        }
    }

    // Transformuje řádek nebo sloupec na základě směru pohybu.
    transform(line, moveTowardsStart) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                this.updateScore(newLine[i]);
                newLine.splice(i + 1, 1);
            }
        }
        while (newLine.length < this.size) {
            newLine.push(0);
        }
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        return newLine;
    }

    // Kontroluje, zda je hra u konce na základě aktuálního stavu herního pole.
    checkGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    return;
                }
                if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
                    return;
                }
                if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
                    return;
                }
            }
        }
        this.gameOverElem.style.display = 'flex';
    }

    // Nastavuje posluchače událostí pro klávesnice a tlačítko restart.
    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                this.move(event.key);
            }
        });

        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
    }
}

// Inicializuje hru po načtení obsahu DOM.
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
