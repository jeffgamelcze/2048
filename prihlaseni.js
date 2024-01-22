document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const userInfoContainer = document.getElementById('user-info-container');
    const logoutBtn = document.getElementById('logout-btn');
    const hraBtn = document.getElementById('hra-btn');
    const loggedInUserElem = document.getElementById('logged-in-user');
    const scoreboardContainer = document.getElementById('scoreboard-container');
    const scoreboardTable = document.getElementById('tabulka');
    const loginBtn = document.getElementById('login-btn');

    // Zkontrolujte, zda je uživatel přihlášen
    const loggedInUser = localStorage.getItem('2048-jmeno');

    if (loggedInUser) {
        // Pokud je uživatel přihlášen, přeskočte zobrazení formuláře pro přihlášení
        loginContainer.style.display = 'none';
        userInfoContainer.style.display = 'block';

        // Zobrazte přihlášeného uživatele
        loggedInUserElem.textContent = `Přihlášený uživatel: ${loggedInUser}`;

        // Zobrazte tabulku skóre
        displayScoreboard();
    } else {
        // Pokud není uživatel přihlášen, zobrazte formulář pro přihlášení
        loginContainer.style.display = 'block';
    }

    // Event listener pro kliknutí na tlačítko přihlášení
    loginBtn.addEventListener('click', () => {
        const jmenoInput = document.getElementById('jmeno');
        const jmeno = jmenoInput.value.trim();

        if (jmeno) {
            // Uložte uživatelské jméno do localStorage
            localStorage.setItem('2048-jmeno', jmeno);

            // Skryjte kontejner pro přihlášení, zobrazte informace o uživateli
            loginContainer.style.display = 'none';
            userInfoContainer.style.display = 'block';

            // Zobrazte přihlášeného uživatele
            loggedInUserElem.textContent = `Přihlášený uživatel: ${jmeno}`;

            // Zobrazte tabulku skóre
            displayScoreboard();
        } else {
            alert('Prosím, zadejte své jméno.');
        }
    });

    // Event listener pro kliknutí na tlačítko odhlášení
    logoutBtn.addEventListener('click', () => {
        // Vymažte uživatelské jméno z localStorage
        localStorage.removeItem('2048-jmeno');

        // Skryjte informace o uživateli, zobrazte formulář pro přihlášení
        userInfoContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    // Event listener pro kliknutí na tlačítko pro hraní
    hraBtn.addEventListener('click', () => {
        // Přesměrujte na hra.html
        window.location.href = 'hra.html';
    });

    // Funkce pro zobrazení tabulky skóre
    function displayScoreboard() {
        // Funkce pro zobrazení tabulky skóre
        const highScore = localStorage.getItem('2048-highScore');

        // Vyčistěte existující obsah
        scoreboardTable.innerHTML = '';

        // Vytvořte hlavičku tabulky
        const headerRow = document.createElement('tr');
        const headerPlayer = document.createElement('th');
        headerPlayer.textContent = 'Hráč';
        const headerScore = document.createElement('th');
        headerScore.textContent = 'Nejvyšší skóre';
        headerRow.appendChild(headerPlayer);
        headerRow.appendChild(headerScore);
        scoreboardTable.appendChild(headerRow);

        // Naplňte tabulku daty
        if (highScore) {
            const row = document.createElement('tr');
            const cellPlayer = document.createElement('td');
            cellPlayer.textContent = loggedInUser;
            const cellScore = document.createElement('td');
            cellScore.textContent = highScore;
            row.appendChild(cellPlayer);
            row.appendChild(cellScore);
            scoreboardTable.appendChild(row);
        }
    }
});
