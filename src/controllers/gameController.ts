import { GameModel } from '../models/gameModel';
import { BoardView } from '../views/boardView';
import { MenuView } from '../views/menuView';
import { BoardController } from './boardController';
import { MenuController } from './menuController';

export class GameController {
  private model: GameModel;
  private boardView: BoardView;
  private boardController: any;
  private menuView: MenuView;
  private menuController: any;

  constructor() {
    this.model = new GameModel();
    this.boardView = new BoardView();
    this.boardController = new BoardController(this.model, this.boardView);
    this.menuView = new MenuView();
    this.menuController = new MenuController(this.model, this.menuView);
  }

  public init() {
    document.body.appendChild(this.menuView.element);
    document.body.appendChild(this.boardView.element);
  }
}
