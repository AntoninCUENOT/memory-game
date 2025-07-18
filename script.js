class MemoryGame {
    constructor() {
        this.cardImages = [
            'assets/css.png',
            'assets/git.png',
            'assets/html.png',
            'assets/js.png',
            'assets/node.png',
            'assets/php.png',
            'assets/react.png',
            'assets/vue.png'
        ];
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.gameStarted = false;
        this.gameWon = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;

        this.initializeElements();
        this.checkForSavedGame();
        this.initializeGame();
        this.bindEvents();
    }

    checkForSavedGame() {
        // Vérifier s'il y a une partie sauvegardée au démarrage
        const savedData = localStorage.getItem('memoryGameSave');
        if (savedData) {
            this.loadBtn.disabled = false;
        }
    }

    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.movesCounter = document.getElementById('moves-counter');
        this.timer = document.getElementById('timer');
        this.resetBtn = document.getElementById('reset-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.loadBtn = document.getElementById('load-btn');
        this.victoryModal = document.getElementById('victory-modal');
        this.victoryMessage = document.getElementById('victory-message');
    }

    createCards() {
        const gameCards = [];
        this.cardImages.forEach((image, index) => {
            gameCards.push(
                { id: index * 2, image, matched: false },
                { id: index * 2 + 1, image, matched: false }
            );
        });

        // Mélanger les cartes
        for (let i = gameCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
        }

        return gameCards;
    }

    initializeGame() {
        this.cards = this.createCards();
        this.flippedCards = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.gameStarted = false;
        this.gameWon = false;
        this.startTime = null;
        this.elapsedTime = 0;

        this.clearTimer();
        this.updateDisplay();
        this.renderCards();
    }

    renderCards() {
        this.gameBoard.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;

            cardElement.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front">?</div>
                            <div class="card-back">
                                <img src="${card.image}" alt="Card" style="width: 90%; height: 90%; object-fit: contain;">
                            </div>
                        </div>
                    `;

            cardElement.addEventListener('click', () => this.handleCardClick(index));
            this.gameBoard.appendChild(cardElement);
        });
    }

    handleCardClick(cardIndex) {
        if (!this.gameStarted) {
            this.startGame();
        }

        // Vérifier si la carte peut être retournée
        if (
            this.flippedCards.length >= 2 ||
            this.flippedCards.includes(cardIndex) ||
            this.matchedPairs.some(pair => pair.includes(cardIndex))
        ) {
            return;
        }

        this.flipCard(cardIndex);
        this.flippedCards.push(cardIndex);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }

    flipCard(index) {
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        cardElement.classList.add('flipped');
    }

    unflipCard(index) {
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        cardElement.classList.remove('flipped');
    }

    markAsMatched(index) {
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        cardElement.classList.add('matched');
    }

    checkMatch() {
        const [firstIndex, secondIndex] = this.flippedCards;
        const firstCard = this.cards[firstIndex];
        const secondCard = this.cards[secondIndex];

        if (firstCard.image === secondCard.image) {
            // Paire trouvée
            this.matchedPairs.push([firstIndex, secondIndex]);
            this.markAsMatched(firstIndex);
            this.markAsMatched(secondIndex);
            this.flippedCards = [];

            // Vérifier si le jeu est terminé
            if (this.matchedPairs.length === this.cardImages.length) {
                this.endGame();
            }
        } else {
            // Pas de correspondance
            setTimeout(() => {
                this.unflipCard(firstIndex);
                this.unflipCard(secondIndex);
                this.flippedCards = [];
            }, 1000);
        }
    }

    startGame() {
        this.gameStarted = true;
        this.startTime = Date.now();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.gameStarted && !this.gameWon) {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateTimer();
            }
        }, 100);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    endGame() {
        this.gameWon = true;
        this.gameStarted = false;
        this.clearTimer();
        this.showVictoryModal();
    }

    showVictoryModal() {
        const timeString = this.formatTime(this.elapsedTime);
        this.victoryMessage.textContent = `Vous avez terminé le jeu en ${this.moves} mouvements et en ${timeString} !`;
        this.victoryModal.style.display = 'block';
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        this.movesCounter.textContent = `${this.moves} mouvements`;
        this.updateTimer();
    }

    updateTimer() {
        this.timer.textContent = this.formatTime(this.elapsedTime);
    }

    saveGame() {
        const gameState = {
            cards: this.cards,
            flippedCards: this.flippedCards,
            matchedPairs: this.matchedPairs,
            moves: this.moves,
            gameStarted: this.gameStarted,
            gameWon: this.gameWon,
            elapsedTime: this.elapsedTime,
            startTime: this.startTime ? Date.now() - this.elapsedTime : null
        };

        // Sauvegarder dans le localStorage
        localStorage.setItem('memoryGameSave', JSON.stringify(gameState));
        this.loadBtn.disabled = false;
        alert('Partie sauvegardée dans le localStorage !');
    }

    loadGame() {
        const savedData = localStorage.getItem('memoryGameSave');
        if (!savedData) {
            alert('Aucune partie sauvegardée trouvée !');
            return;
        }

        const gameState = JSON.parse(savedData);
        this.clearTimer();

        this.cards = gameState.cards;
        this.flippedCards = gameState.flippedCards;
        this.matchedPairs = gameState.matchedPairs;
        this.moves = gameState.moves;
        this.gameStarted = gameState.gameStarted;
        this.gameWon = gameState.gameWon;
        this.elapsedTime = gameState.elapsedTime;
        this.startTime = gameState.startTime;

        this.renderCards();
        this.updateDisplay();

        // Restaurer l'état visuel des cartes
        this.flippedCards.forEach(index => this.flipCard(index));
        this.matchedPairs.forEach(pair => {
            pair.forEach(index => {
                this.flipCard(index);
                this.markAsMatched(index);
            });
        });

        if (this.gameStarted && !this.gameWon) {
            this.startTimer();
        }
    }

    bindEvents() {
        this.resetBtn.addEventListener('click', () => this.initializeGame());
        this.saveBtn.addEventListener('click', () => this.saveGame());
        this.loadBtn.addEventListener('click', () => this.loadGame());
    }
}

function closeModal() {
    document.getElementById('victory-modal').style.display = 'none';
    game.initializeGame();
}

window.onclick = function (event) {
    const modal = document.getElementById('victory-modal');
    if (event.target === modal) {
        closeModal();
    }
}


const game = new MemoryGame();