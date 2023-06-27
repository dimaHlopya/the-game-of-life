import { ActionType } from '../constants/eventTypes';
import { GameModel } from '../models/gameModel';
import { Event, ObservableController } from '../types/controllers';
import { MenuView } from '../views/menuView';

export class MenuController implements ObservableController {
  model: GameModel;
  view: MenuView;

  constructor(model: GameModel, view: MenuView) {
    this.model = model;
    this.view = view;
    this.model.addObserver(this);

    this.view.bindCreateBoard(this.handleCreateBoard.bind(this));
    this.view.bindStartGame(this.handleStartGame.bind(this));
    this.view.bindPauseGame(this.handlePauseGame.bind(this));
    this.view.bindClearBoard(this.handleClearBoard.bind(this));
  }

  handleCreateBoard(n: number, m: number) {
    this.model.pauseGame();
    this.model.setSize(n, m);
  }

  handleClearBoard() {
    this.model.clearBoard();
  }

  update(event: Event) {
    switch (event.type) {
      case ActionType.IS_PLAYING:
        this.view.gameStarted();
        return;
      case ActionType.IS_ON_PAUSE:
        this.view.gamePaused();
        return;
      case ActionType.BOARD_CLEARED:
        this.view.boardCleared();
        return;
      default:
        null;
    }
  }

  handleStartGame() {
    this.model.startGame();
  }

  handlePauseGame() {
    this.model.pauseGame();
  }
}
