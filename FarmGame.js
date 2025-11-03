import { Cell } from '../js/classes/Cell.js';
import { Potato } from '../js/plants/Potato.js';
import { Cactus } from '../js/plants/Cactus.js';
import { MarshPlant } from '../js/plants/MarshPlant.js';

// Основной класс игры
export class FarmGame {
  constructor(gridSize = 10) {
    this.gridSize = gridSize;
    this.grid = [];
    this.selectedTool = 'shovel';
    this.day = 1;
    this.initGrid();
    this.renderGrid();
    this.setupEventListeners();
  }

  // Инициализация сетки
  initGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        // Создаем случайную сетку с водой и землей
        const isWater = Math.random() < 0.2; // 20% шанс воды
        this.grid[i][j] = new Cell(isWater ? 'water' : 'land', isWater ? 100 : 20);
      }
    }

    // Распространяем влажность от водных клеток
    this.calculateMoisture();
  }

  // Расчет влажности на основе близости к воде
  calculateMoisture() {
    // Сначала сбрасываем влажность для земляных клеток
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j].type === 'land') {
          this.grid[i][j].moisture = 20;
        }
      }
    }

    // Затем распространяем влажность от водных клеток
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j].type === 'water') {
          this.spreadMoisture(i, j);
        }
      }
    }
  }

  // Распространение влажности от водной клетки
  spreadMoisture(waterX, waterY) {
    const maxDistance = 3; // Максимальное расстояние распространения влажности

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j].type === 'land') {
          const distance = Math.max(1, Math.abs(i - waterX) + Math.abs(j - waterY));
          if (distance <= maxDistance) {
            // Влажность уменьшается с расстоянием
            const moistureGain = 30 - (distance * 8);
            this.grid[i][j].moisture = Math.min(100, this.grid[i][j].moisture + moistureGain);
          }
        }
      }
    }
  }

  // Отрисовка сетки
  renderGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cellElement = document.createElement('div');
        cellElement.dataset.row = i;
        cellElement.dataset.col = j;

        this.grid[i][j].updateAppearance(cellElement);

        cellElement.addEventListener('click', () => this.handleCellClick(i, j));

        gridElement.appendChild(cellElement);
      }
    }

    // Обновляем статистику
    document.getElementById('selected-tool').textContent = this.getToolName();
    document.getElementById('day-counter').textContent = this.day;
  }

  // Обработка клика по клетке
  handleCellClick(row, col) {
    const cell = this.grid[row][col];

    switch(this.selectedTool) {
      case 'shovel':
        if (cell.type === 'water') {
          cell.removeWater();
        } else if (cell.plant) {
          cell.plant = null;
        } else {
          cell.type = 'water';
          cell.moisture = 100;
        }
        this.calculateMoisture();
        break;

      case 'water':
        if (cell.type === 'land') {
          cell.addWater();
        }
        break;

      case 'potato':
        if (cell.type === 'land' && !cell.plant) {
          cell.plant = new Potato();
          cell.plant.checkHealth(cell.moisture);
        }
        break;

      case 'cactus':
        if (cell.type === 'land' && !cell.plant) {
          cell.plant = new Cactus();
          cell.plant.checkHealth(cell.moisture);
        }
        break;

      case 'marsh-plant':
        if (cell.type === 'land' && !cell.plant) {
          cell.plant = new MarshPlant();
          cell.plant.checkHealth(cell.moisture);
        }
        break;
    }

    this.renderGrid();
  }

  // Настройка обработчиков событий
  setupEventListeners() {
    // Выбор инструмента
    document.querySelectorAll('.tool').forEach(tool => {
      tool.addEventListener('click', () => {
        document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
        tool.classList.add('active');
        this.selectedTool = tool.dataset.tool;
        document.getElementById('selected-tool').textContent = this.getToolName();
      });
    });

    // Кнопка следующего дня
    document.getElementById('next-day').addEventListener('click', () => {
      this.nextDay();
    });
  }

  // Переход на следующий день
  nextDay() {
    this.day++;

    // Уменьшаем влажность на земляных клетках
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j].type === 'land') {
          this.grid[i][j].moisture = Math.max(0, this.grid[i][j].moisture - 5);
        }
      }
    }

    // Растения растут или погибают
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid[i][j];
        if (cell.plant && !cell.plant.isDead) {
          cell.plant.checkHealth(cell.moisture);
          if (!cell.plant.isDead) {
            cell.plant.grow();
          }
        }
      }
    }

    this.renderGrid();
  }

  // Получение имени инструмента для отображения
  getToolName() {
    const toolNames = {
      'shovel': 'Лопата',
      'water': 'Ведро',
      'potato': 'Картофель',
      'cactus': 'Кактус',
      'marsh-plant': 'Болотник'
    };

    return toolNames[this.selectedTool];
  }
}
