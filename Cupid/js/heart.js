export class Heart {
    constructor(canvasWidth, canvasHeight) {
        this.size = 35 + Math.random() * 25;
        this.direction = Math.random() > 0.5 ? 1 : -1; // 1 - вправо, -1 - влево


        // Начальная позиция зависит от направления
        if (this.direction > 0) {
            this.x = -this.size;
        } else {
            this.x = canvasWidth + this.size;
        }


        this.y = Math.random() * (canvasHeight * 0.7) + canvasHeight * 0.15;
        this.speed = 2 + Math.random() * 3;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.pulse = 0;
        this.pulseSpeed = 0.04;
        this.isExploding = false;
        this.explosionProgress = 0;


        // Определяем тип сердца и очки
        const heartType = Math.random();
        if (heartType < 0.6) {
            // Фиолетовое сердце - 60% chance
            this.color = '#8A2BE2'; // фиолетовый
            this.points = 1;
        } else if (heartType < 0.9) {
            // Розовое сердце - 30% chance
            this.color = '#FF69B4'; // розовый
            this.points = 5;
        } else {
            // Красное сердце - 10% chance
            this.color = '#DC143C'; // красный
            this.points = -2;
        }
    }


    update(deltaTime) {
        if (!this.isExploding) {
            // Движение по горизонтали
            this.x += this.speed * this.direction;
            this.rotation += this.rotationSpeed;
            this.pulse = Math.sin(Date.now() * this.pulseSpeed) * 0.15 + 1;
        } else {
            // Анимация взрыва
            this.explosionProgress += 0.05;
            this.pulse = 1 + this.explosionProgress * 2;
        }
    }


    explode() {
        this.isExploding = true;
        this.explosionProgress = 0;
    }


    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.pulse, this.pulse);


        if (this.isExploding) {
            // Эффект взрыва - сердце исчезает
            ctx.globalAlpha = 1 - this.explosionProgress;


            // Добавляем частицы при взрыве
            if (this.explosionProgress < 0.5) {
                this.drawExplosionParticles(ctx);
            }
        }


        this.drawHeart(ctx, 0, 0, this.size);
        ctx.restore();
    }


    drawHeart(ctx, x, y, size) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;


        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + size * 0.25);


        // Верхняя левая кривая
        ctx.bezierCurveTo(
            x, y,
            x - size * 0.5, y,
            x - size * 0.5, y + size * 0.25
        );


        // Нижняя левая кривая
        ctx.bezierCurveTo(
            x - size * 0.5, y + size * 0.5,
            x, y + size * 0.7,
            x, y + size
        );


        // Нижняя правая кривая
        ctx.bezierCurveTo(
            x, y + size * 0.7,
            x + size * 0.5, y + size * 0.5,
            x + size * 0.5, y + size * 0.25
        );


        // Верхняя правая кривая
        ctx.bezierCurveTo(
            x + size * 0.5, y,
            x, y,
            x, y + size * 0.25
        );


        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;
    }


    drawExplosionParticles(ctx) {
        const particleCount = 8;
        const particleSize = this.size * 0.1;


        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = this.explosionProgress * this.size * 2;
            const px = Math.cos(angle) * distance;
            const py = Math.sin(angle) * distance;


            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}