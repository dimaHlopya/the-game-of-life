import { ActionType } from '../constants/eventTypes';
import { ObservableController } from '../types/controllers';

export class GameModel {
  cells: number[][];
  width: number;
  height: number;
  isPlaying: boolean;
  playingIntervalId: ReturnType<typeof setInterval>;
  observers: any[];
  aliveCells: Map<string, number>;

  constructor() {
    this.width = 0;
    this.height = 0;
    this.cells = [];
    this.observers = [];
    this.aliveCells = new Map();
  }

  addObserver(observer: ObservableController) {
    this.observers.push(observer);
  }

  notifyObservers(callback: { type: ActionType; payload?: unknown }) {
    this.observers.forEach(observer => {
      observer.update(callback);
    });
  }

  setSize(height: number, width: number) {
    this.height = height;
    this.width = width;

    this.notifyObservers({
      type: ActionType.SIZE_CHANGED,
      payload: { width, height },
    });

    this.createCells(height, width);
  }

  createCells(height: number, width: number) {
    this.clearBoard();

    this.notifyObservers({
      type: ActionType.BOARD_CREATED,
      payload: { height, width },
    });
  }

  toggleCellState(row: number, col: number) {
    if (!this.isPlaying) {
      const key = `${row},${col}`;

      if (this.aliveCells.has(key)) {
        this.aliveCells.delete(key);

        this.notifyObservers({
          type: ActionType.CELL_UPDATED,
          payload: { row, col, state: 0 },
        });
      } else {
        const liveNeighbors = this.countLiveNeighbors(
          this.aliveCells,
          row,
          col
        );

        this.aliveCells.set(key, liveNeighbors);

        this.notifyObservers({
          type: ActionType.CELL_UPDATED,
          payload: { row, col, state: 1 },
        });
      }
    }
  }

  countLiveNeighbors(liveCells: Map<string, number>, i: number, j: number) {
    let count = 0;

    for (let ni = i - 1; ni <= i + 1; ni++) {
      for (let nj = j - 1; nj <= j + 1; nj++) {
        if (ni === i && nj === j) {
          continue;
        }

        if (liveCells.has(`${ni},${nj}`)) {
          count++;
        }
      }
    }

    return count;
  }

  startGame() {
    this.isPlaying = true;
    this.playingIntervalId = setInterval(
      this.updateCellsToNextGeneration.bind(this),
      500
    );

    this.notifyObservers({
      type: ActionType.IS_PLAYING,
    });
  }

  pauseGame() {
    if (this.playingIntervalId) {
      clearInterval(this.playingIntervalId);
      this.playingIntervalId = null;
    }
    this.isPlaying = false;

    this.notifyObservers({
      type: ActionType.IS_ON_PAUSE,
    });
  }

  clearBoard() {
    this.notifyObservers({
      type: ActionType.BOARD_CLEARED,
      payload: Array.from(this.aliveCells.keys()),
    });

    this.aliveCells.clear();
  }

  updateCellsToNextGeneration() {
    const nextGeneration = new Map();
    const nextDeadCells = new Map();
    const neighbourCounts = new Map();

    for (const key of Array.from(this.aliveCells.keys())) {
      const [i, j] = key.split(',').map(Number);

      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) {
            continue;
          }

          const ni = i + di;
          const nj = j + dj;

          const neighbourKey = `${(ni + this.height) % this.height},${
            (nj + this.width) % this.width
          }`;
          const count = neighbourCounts.get(neighbourKey) || 0;
          neighbourCounts.set(neighbourKey, count + 1);
        }
      }
    }

    for (const [key, count] of Array.from(neighbourCounts)) {
      const aliveCell = this.aliveCells.has(key);

      if (aliveCell && (count < 2 || count > 3)) {
        nextDeadCells.set(key, true);
      } else if (!aliveCell && count === 3) {
        nextGeneration.set(key, true);
      } else {
        if (aliveCell) {
          nextGeneration.set(key, true);
        } else {
          nextDeadCells.set(key, true);
        }
      }
    }

    for (const key of Array.from(this.aliveCells.keys())) {
      const [i, j] = key.split(',').map(Number);
      let hasNeighbor = false;

      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) {
            continue;
          }

          const ni = i + di;
          const nj = j + dj;

          const neighbourKey = `${ni},${nj}`;

          if (nextGeneration.has(neighbourKey)) {
            hasNeighbor = true;
          }
        }
      }

      if (!hasNeighbor) {
        nextDeadCells.set(key, true);
      }
    }

    this.aliveCells = nextGeneration;

    this.notifyObservers({
      type: ActionType.CELLS_UPDATED,
      payload: {
        nextGeneration: Array.from(nextGeneration.keys()),
        nextDeadCells: Array.from(nextDeadCells.keys()),
      },
    });

    if (!nextGeneration.size) {
      this.pauseGame();
    }
  }
}
