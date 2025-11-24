import { Game } from './game.js';


class App {
    constructor() {
        this.game = null;
        this.init();
    }


    init() {
        this.menuScreen = document.getElementById('menuScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');


        this.playButton = document.getElementById('playButton');
        this.restartButton = document.getElementById('restartButton');
        this.menuButton = document.getElementById('menuButton');


        this.setupEventListeners();
    }


    setupEventListeners() {
        this.playButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
        this.menuButton.addEventListener('click', () => this.showMenu());
    }


    startGame() {
        this.hideAllScreens();
        this.gameScreen.classList.remove('hidden');


        if (this.game) {
            this.game.cleanup();
        }


        this.game = new Game();
        this.game.start();


        this.game.onGameOver = (score) => {
            this.showGameOver(score);
        };
    }


    showMenu() {
        this.hideAllScreens();
        this.menuScreen.classList.remove('hidden');
    }


    showGameOver(score) {
        this.hideAllScreens();
        document.getElementById('finalScore').textContent = score;
        this.gameOverScreen.classList.remove('hidden');
    }


    hideAllScreens() {
        this.menuScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }
}


new App();