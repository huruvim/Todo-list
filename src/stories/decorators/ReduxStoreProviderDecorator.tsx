import React from 'react';
import {Provider} from 'react-redux';
import {combineReducers} from 'redux';
import {tasksReducer, todolistsReducer} from 'features/TodolistsList';
import {v1} from 'uuid';
import {applicationReducer} from 'features/Application';
import thunkMiddleware from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from 'features/Auth';
import {HashRouter} from 'react-router-dom';
import {AppRootStateType, RootReducerType} from '../../utils/types';
import {TaskPriorities, TaskStatuses} from '../../utils/api/types';

const rootReducer: RootReducerType = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: applicationReducer,
  auth: authReducer
});

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: 'todolistId1',
      title:
        'What to learn What to learn What to learn What to learn What to learn What to learn What to learn',
      filter: 'all',
      entityStatus: 'idle',
      addedDate: '',
      order: 0
    },
    {
      id: 'todolistId2',
      title: 'What to buy',
      filter: 'all',
      entityStatus: 'loading',
      addedDate: '',
      order: 0
    }
  ],
  tasks: {
    todolistId1: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      }
    ],
    todolistId2: [
      {
        id: v1(),
        title: 'Milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: v1(),
        title: 'React Book',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      }
    ]
  },
  app: {
    error: null,
    status: 'succeeded',
    isInitialized: true
  },
  auth: {
    isLoggedIn: true
  }
};

export const storyBookStore = configureStore({
  preloadedState: initialGlobalState,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
});

export const ReduxStoreProviderDecorator = (storyFn: any) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};

export const BrowserRouterDecorator = (storyFn: any) => {
  return <HashRouter>{storyFn()}</HashRouter>;
};
