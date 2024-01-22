document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 4;
    let board = [];
    let currentScore = 0;
    const currentScoreElem = document.getElementById('current-score');

    // Získání nejvyššího skóre z místního úložiště nebo nastavení na 0, pokud není nalezeno
    let highScore = localStorage.getItem('2048-highScore') || 0;
    const highScoreElem = document.getElementById('high-score');
    highScoreElem.textContent = highScore;

    const gameOverElem = document.getElementById('game-over');

   // Funkce pro aktualizaci skóre
    function updateScore(value) {
        currentScore += value;
        currentScoreElem.textContent = currentScore;
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElem.textContent = highScore;
            localStorage.setItem('2048-highScore', highScore);
        }
    }

    // Funkce pro aktualizaci skóre
    function restartGame() {
        currentScore = 0;
        currentScoreElem.textContent = '0';
        gameOverElem.style.display = 'none';
        // Přesměrování na prihlaseni.html
        window.location.href = 'prihlaseni.html';
    }

    // Funkce pro spuštění skóre
    function initializeGame() {
        board = [...Array(size)].map(e => Array(size).fill(0));
        placeRandom();
        placeRandom();
        renderBoard();
    }

    // Funkce pro zobrazení herního pole na rozhraní
    function renderBoard() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                const prevValue = cell.dataset.value;
                const currentValue = board[i][j];
                if (currentValue !== 0) {
                    cell.dataset.value = currentValue;
                    cell.textContent = currentValue;
                    // Řízení animací
                    if (currentValue !== parseInt(prevValue) && !cell.classList.contains('new-tile')) {
                        cell.classList.add('merged-tile');
                    }
                } else {
                    cell.textContent = '';
                    delete cell.dataset.value;
                    cell.classList.remove('merged-tile', 'new-tile');
                }
            }
        }

        // Cleanup animation classes
        setTimeout(() => {
            const cells = document.querySelectorAll('.grid-cell');
            cells.forEach(cell => {
                cell.classList.remove('merged-tile', 'new-tile');
            });
        }, 300);
    }

    // Funkce pro umístění náhodného bloku na herní pole
    function placeRandom() {
        const available = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    available.push({ x: i, y: j });
                }
            }
        }

        if (available.length > 0) {
            const randomCell = available[Math.floor(Math.random() * available.length)];
            board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
            const cell = document.querySelector(`[data-row="${randomCell.x}"][data-col="${randomCell.y}"]`);
            cell.classList.add('new-tile'); // Animace pro nové bloky
        }
    }

    // Funkce pro pohyb bloků na základě stisknutí šipek
    function move(direction) {
        let hasChanged = false;
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let j = 0; j < size; j++) {
                const column = [...Array(size)].map((_, i) => board[i][j]);
                const newColumn = transform(column, direction === 'ArrowUp');
                for (let i = 0; i < size; i++) {
                    if (board[i][j] !== newColumn[i]) {
                        hasChanged = true;
                        board[i][j] = newColumn[i];
                    }
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let i = 0; i < size; i++) {
                const row = board[i];
                const newRow = transform(row, direction === 'ArrowLeft');
                if (row.join(',') !== newRow.join(',')) {
                    hasChanged = true;
                    board[i] = newRow;
                }
            }
        }
        if (hasChanged) {
            placeRandom();
            renderBoard();
            checkGameOver();
        }
    }

    // Funkce pro transformaci řádku nebo sloupce v závislosti na směru pohybu
    function transform(line, moveTowardsStart) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                updateScore(newLine[i]); // Aktualizace skóre po sloučení bloků
                newLine.splice(i + 1, 1);
            }
        }
        while (newLine.length < size) {
            newLine.push(0);
        }
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        return newLine;
    }

    // Funkce pro kontrolu, zda je hra u konce
function checkGameOver() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                return; // Existuje prázdná buňka, takže hra není u konce
            }
            if (j < size - 1 && board[i][j] === board[i][j + 1]) {
                return; // Existují horizontálně sousedící stejné bloky, takže je možný pohyb
            }
            if (i < size - 1 && board[i][j] === board[i + 1][j]) {
                return; // Existují vertikálně sousedící stejné bloky, takže je možný pohyb
            }
        }
    }

    // Pokud jsme až sem došli, tak žádný pohyb již není možný
    gameOverElem.style.display = 'flex';

    // Event listeners
    document.addEventListener('keydown', event => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            move(event.key);
        }
    });
    document.getElementById('restart-btn').addEventListener('click', restartGame);

    initializeGame();
}})
