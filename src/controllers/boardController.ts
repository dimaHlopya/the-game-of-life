import { ActionType } from '../constants/eventTypes';
import { GameModel } from '../models/gameModel';
import { Event, ObservableController } from '../types/controllers';
import { BoardView } from '../views/boardView';

export class BoardController implements ObservableController {
  model: GameModel;
  view: BoardView;

  constructor(model: GameModel, view: BoardView) {
    this.model = model;
    this.view = view;
    this.model.addObserver(this);
    this.view.bindCellClick(this.handleCellClick.bind(this));
  }

  update(event: Event) {
    switch (event.type) {
      case ActionType.BOARD_CREATED:
        this.view.mount(event.payload);
        return;
      case ActionType.SIZE_CHANGED:
        this.view.updateSize(event.payload);
        return;
      case ActionType.CELL_UPDATED:
        this.view.updateCell(event.payload);
        return;
      case ActionType.CELLS_UPDATED:
        this.view.updateCells(event.payload);
        return;
      case ActionType.BOARD_CLEARED:
        this.view.clearBoard(event.payload);
        return;
      default:
        null;
    }
  }

  handleCellClick(e: MouseEvent, cellSize: number) {
    const rect = this.view.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    this.model.toggleCellState(row, col);
  }
}
