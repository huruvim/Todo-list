import {sliceTodolist, asyncActions as todolistsAsyncActions} from './todolists-reducer';
import {asyncActions as tasksActions} from './tasks-reducer';
import {TodolistsList} from './TodolistsList';
export {todolistsReducer} from './todolists-reducer';
export {tasksReducer} from './tasks-reducer';

const todolistsActions = {
  ...todolistsAsyncActions,
  ...sliceTodolist.actions
};

export {tasksActions, todolistsActions, TodolistsList};
