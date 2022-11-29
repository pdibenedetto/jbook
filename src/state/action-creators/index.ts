import { ActionType } from '../action-types';
import {
  DeleteCellAction,
  InsertCellBeforeAction,
  MoveCellAction,
  UpdateCellAction,
} from '../actions';
import { CellType } from '../cell';
import { Direction } from '../direction';

export const moveCell = (
  id: string,
  direction: Direction,
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const insertCellBefore = (
  id: string,
  cellType: CellType
): InsertCellBeforeAction => {
  return {
    type: ActionType.INSERT_CELL_BEFORE,
    payload: {
      id,
      type: cellType,
    },
  };
};

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};
