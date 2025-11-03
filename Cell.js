// Базовый класс Клетка
export class Cell {
  constructor(type, moisture = 0) {
    this.type = type; // 'land' или 'water'
    this.moisture = moisture; // Уровень влажности от 0 до 100
    this.plant = null; // Растение на клетке
  }

  // Обновление внешнего вида клетки
  updateAppearance(element) {
    if (this.type === 'water') {
      element.className = 'cell water';
      element.innerHTML = '';
    } else {
      // Земля меняет цвет в зависимости от влажности
      const hue = 30; // Базовый оттенок коричневого
      const saturation = 70;
      const lightness = 50 - (this.moisture / 100) * 20; // Темнее при большей влажности

      element.className = 'cell land';
      element.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      // Отображение влажности
      element.innerHTML = `<div style="position: absolute; top: 2px; left: 2px; font-size: 10px; color: rgba(0,0,0,0.7)">${Math.round(this.moisture)}%</div>`;

      // Отображение растения, если есть
      if (this.plant) {
        const plantDiv = document.createElement('div');
        plantDiv.className = `plant ${this.plant.type} growth-stage-${this.plant.growthStage}`;

        if (this.plant.isDead) {
          plantDiv.classList.add('dead-plant');
        }

        element.appendChild(plantDiv);
      }
    }
  }

  // Добавление воды на клетку
  addWater() {
    if (this.type === 'land') {
      this.moisture = Math.min(100, this.moisture + 30);
      return true;
    }
    return false;
  }

  // Удаление воды с клетки
  removeWater() {
    if (this.type === 'water') {
      this.type = 'land';
      this.moisture = 20;
      return true;
    }
    return false;
  }
}
