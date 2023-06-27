import { ActionType } from '../constants/eventTypes';

export interface ObservableController {
  update: (event: Event) => void;
}

export type Size = {
  n: number;
  m: number;
};

export type Event = {
  type: ActionType;
  payload: any;
};
