import {TodolistDomainType, todolistsReducer} from './todolists-reducer';
import {TasksStateType, tasksReducer} from './tasks-reducer';
import {TodolistType} from '../../utils/api/types';
import {todolistsActions} from './index';

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0
  };

  const action = todolistsActions.addTodolist.fulfilled(todolist, '', '');

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolists).toBe(action.payload.id);
});
