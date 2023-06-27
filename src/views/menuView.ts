import {
  BindClearBoardHandler,
  BindCreateBoardHandler,
  BindPauseGameHandler,
  BindStartGameHandler,
} from '../types/views';

export class MenuView {
  public element: HTMLElement;
  private startButton: HTMLButtonElement;
  private pauseButton: HTMLButtonElement;
  private createBoardButton: HTMLButtonElement;
  private clearBoardButton: HTMLButtonElement;
  private nField: HTMLInputElement;
  private mField: HTMLInputElement;

  constructor() {
    this.element = document.createElement('div');

    this.createBoardButton = document.createElement('button');
    this.createBoardButton.innerText = 'Create board';

    this.clearBoardButton = document.createElement('button');
    this.clearBoardButton.innerText = 'Clear board';
    this.clearBoardButton.hidden = true;

    this.startButton = document.createElement('button');
    this.startButton.innerText = 'Start';
    this.startButton.disabled = true;

    this.pauseButton = document.createElement('button');
    this.pauseButton.innerText = 'Pause';
    this.pauseButton.disabled = true;

    this.nField = document.createElement('input');
    this.nField.type = 'number';
    this.nField.placeholder = 'height';
    this.nField.value = '10';

    this.mField = document.createElement('input');
    this.mField.type = 'number';
    this.mField.placeholder = 'width';
    this.mField.value = '10';

    this.bindOwnListeners();
    this.mount();
  }

  private bindOwnListeners() {
    this.nField.addEventListener(
      'input',
      this.handleChangeSizeField.bind(this)
    );
    this.mField.addEventListener(
      'input',
      this.handleChangeSizeField.bind(this)
    );
  }

  private handleChangeSizeField() {
    if (!Boolean(this.nField.value) || !Boolean(this.mField.value)) {
      this.createBoardButton.disabled = true;
    } else {
      this.createBoardButton.disabled = false;
    }

    this.createBoardButton.hidden = false;
  }

  public gameStarted() {
    this.nField.disabled = true;
    this.mField.disabled = true;
    this.createBoardButton.disabled = true;
    this.startButton.disabled = true;
    this.clearBoardButton.disabled = true;
    this.pauseButton.disabled = false;
  }

  public gamePaused() {
    this.nField.disabled = false;
    this.mField.disabled = false;
    this.createBoardButton.disabled = false;
    this.clearBoardButton.disabled = false;
    this.startButton.disabled = false;
    this.pauseButton.disabled = true;
  }

  public bindCreateBoard(handler: BindCreateBoardHandler) {
    this.createBoardButton.addEventListener('click', () => {
      const n = this.nField.value;
      const m = this.mField.value;

      handler(Number(n), Number(m));

      this.createBoardButton.hidden = true;
      this.startButton.disabled = false;
    });
  }

  public bindClearBoard(handler: BindClearBoardHandler) {
    this.clearBoardButton.addEventListener('click', handler);
  }

  public bindStartGame(handler: BindStartGameHandler) {
    this.startButton.addEventListener('click', handler);
  }

  public bindPauseGame(handler: BindPauseGameHandler) {
    this.pauseButton.addEventListener('click', handler);
  }

  public boardCleared() {
    this.clearBoardButton.hidden = false;
  }

  public mount() {
    this.element.appendChild(this.nField);
    this.element.appendChild(this.mField);
    this.element.appendChild(this.createBoardButton);
    this.element.appendChild(this.clearBoardButton);
    this.element.appendChild(this.startButton);
    this.element.appendChild(this.pauseButton);
  }
}
