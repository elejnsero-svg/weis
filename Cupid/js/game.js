import { Heart } from './heart.js';
import { Arrow } from './arrow.js';


export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');


        // Загрузка фонового изображения
        this.background = new Image();
        this.background.src = 'https://i.postimg.cc/FRn5P9M4/sd-ultra-In-the-garden-of-love-a-43799292.png';


        this.setupCanvas();
        this.reset();
    }


    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }


    reset() {
        this.score = 0;
        this.timeLeft = 60;
        this.hearts = [];
        this.arrows = [];
        this.isRunning = false;
        this.lastHeartTime = 0;
        this.heartInterval = 1500;


        this.updateScore();
        this.updateTimer();
    }


    start() {
        this.reset();
        this.isRunning = true;
        this.setupEventListeners();
        this.gameLoop();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }


    setupEventListeners() {
        this.clickHandler = (event) => this.handleClick(event);
        this.canvas.addEventListener('click', this.clickHandler);
    }


    handleClick(event) {
        if (!this.isRunning) return;


        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;


        // Создаем стрелу
        const arrow = new Arrow(clickX, clickY);
        this.arrows.push(arrow);


        // Проверяем попадание в сердца
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            if (this.checkCollision(clickX, clickY, heart)) {
                // Добавляем/убираем очки в зависимости от цвета сердца
                this.score += heart.points;
                this.updateScore();


                // Запускаем анимацию взрыва
                heart.explode();


                // Удаляем сердце после взрыва
                setTimeout(() => {
                    const index = this.hearts.indexOf(heart);
                    if (index > -1) {
                        this.hearts.splice(index, 1);
                    }
                }, 300);


                break;
            }
        }
    }


    checkCollision(x, y, heart) {
        const dx = x - heart.x;
        const dy = y - heart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < heart.size;
    }


    spawnHeart(timestamp) {
        if (timestamp - this.lastHeartTime > this.heartInterval) {
            this.hearts.push(new Heart(this.canvas.width, this.canvas.height));
            this.lastHeartTime = timestamp;


            // Уменьшаем интервал для увеличения сложности
            this.heartInterval = Math.max(800, this.heartInterval * 0.995);
        }
    }


    updateHearts(deltaTime) {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            heart.update(deltaTime);


            // Удаляем сердца, вышедшие за пределы экрана
            if ((heart.direction > 0 && heart.x > this.canvas.width + 50) ||
                (heart.direction < 0 && heart.x < -50)) {
                this.hearts.splice(i, 1);
            }
        }
    }


    updateArrows(deltaTime) {
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            const arrow = this.arrows[i];
            arrow.update(deltaTime);


            // Удаляем стрелы после анимации
            if (arrow.lifetime <= 0) {
                this.arrows.splice(i, 1);
            }
        }
    }


    updateScore() {
        this.scoreElement.textContent = this.score;
    }


    updateTimer() {
        if (!this.isRunning) return;


        this.timeLeft--;
        this.timerElement.textContent = this.timeLeft;


        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }


    render() {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


        // Рисуем фон
        if (this.background.complete) {
            this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Запасной фон если изображение не загрузилось
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#90EE90';
            this.ctx.fillRect(0, this.canvas.height * 0.7, this.canvas.width, this.canvas.height * 0.3);
        }


        // Рендерим сердца
        this.hearts.forEach(heart => heart.render(this.ctx));


        // Рендерим стрелы
        this.arrows.forEach(arrow => arrow.render(this.ctx));
    }


    gameLoop(timestamp) {
        if (!this.isRunning) return;


        const deltaTime = timestamp - (this.lastTimestamp || timestamp);
        this.lastTimestamp = timestamp;


        this.spawnHeart(timestamp);
        this.updateHearts(deltaTime);
        this.updateArrows(deltaTime);
        this.render();


        requestAnimationFrame((ts) => this.gameLoop(ts));
    }


    endGame() {
        this.isRunning = false;
        clearInterval(this.timerInterval);


        if (this.onGameOver) {
            this.onGameOver(this.score);
        }
    }


    cleanup() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        if (this.clickHandler) {
            this.canvas.removeEventListener('click', this.clickHandler);
        }
    }
}
