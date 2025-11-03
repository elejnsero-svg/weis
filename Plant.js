// Базовый класс Растение
export class Plant {
  constructor(type, minMoisture, maxMoisture) {
    this.type = type;
    this.minMoisture = minMoisture;
    this.maxMoisture = maxMoisture;
    this.growthStage = 1; // Стадия роста от 1 до 3
    this.isDead = false;
  }

  // Проверка, подходит ли влажность для растения
  checkMoisture(moisture) {
    return moisture >= this.minMoisture && moisture <= this.maxMoisture;
  }

  // Рост растения
  grow() {
    if (!this.isDead && this.growthStage < 3) {
      this.growthStage++;
    }
  }

  // Проверка состояния растения на основе влажности
  checkHealth(moisture) {
    if (!this.checkMoisture(moisture)) {
      this.isDead = true;
    }
  }
}
