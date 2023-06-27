import {
  BoardSize,
  Cell,
  CellClickHandler,
  CellSize,
  UpdateCellsProps,
} from '../types/views';

export class BoardView {
  public element: HTMLElement;
  public canvas: HTMLCanvasElement;
  private cols: number;
  private rows: number;
  private cellSize: CellSize;

  constructor() {
    this.element = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.element.appendChild(this.canvas);
    this.cellSize = 10;
  }

  private drawCell(
    context: CanvasRenderingContext2D,
    i: number,
    j: number,
    isAlive: boolean
  ) {
    context.strokeStyle = 'black';

    if (isAlive) {
      context.fillStyle = 'black';
    }

    if (!isAlive) {
      context.fillStyle = 'white';
    }

    context.fillRect(j, i, this.cellSize, this.cellSize);
    context.strokeRect(j, i, this.cellSize, this.cellSize);
  }

  public updateSize({ width, height }: BoardSize) {
    this.cols = width;
    this.rows = height;
  }

  public clearBoard(cells: string[]) {
    for (const key of cells) {
      const [i, j] = key.split(',').map(Number);

      this.updateCell({ row: i, col: j, state: false });
    }
  }

  public bindCellClick(handler: CellClickHandler) {
    this.canvas.addEventListener('click', (e: MouseEvent) => {
      if (this.rows && this.cols) {
        handler(e, this.cellSize);
      }
    });
  }

  public updateCell({ row, col, state }: Cell) {
    const context = this.canvas.getContext('2d');

    this.drawCell(context, row * this.cellSize, col * this.cellSize, state);
  }

  public updateCells({ nextGeneration, nextDeadCells }: UpdateCellsProps) {
    for (const key of nextGeneration) {
      const [i, j] = key.split(',').map(Number);

      this.updateCell({ row: i, col: j, state: true });
    }

    for (const key of nextDeadCells) {
      const [i, j] = key.split(',').map(Number);

      this.updateCell({ row: i, col: j, state: false });
    }
  }

  public mount({ width, height }: BoardSize) {
    const canvasWidth = width * this.cellSize;
    const canvasHeight = height * this.cellSize;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    const context = this.canvas.getContext('2d');

    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        this.drawCell(context, i * this.cellSize, j * this.cellSize, false);
      }
    }
  }
}
