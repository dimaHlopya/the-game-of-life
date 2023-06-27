export interface BoardSize {
  width: number;
  height: number;
}

export type CellSize = number;

export interface Cell {
  row: number;
  col: number;
  state: boolean;
}

export interface UpdateCellsProps {
  nextGeneration: string[];
  nextDeadCells: string[];
}

export type CellClickHandler = (e: MouseEvent, cellSize: CellSize) => void;
export type BindCreateBoardHandler = (n: number, m: number) => void;
export type BindStartGameHandler = () => void;
export type BindPauseGameHandler = () => void;
export type BindClearBoardHandler = () => void;
