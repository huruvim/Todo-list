import {AppRootStateType} from 'utils/types';
import {createDraftSafeSelector} from '@reduxjs/toolkit';

const appSelector = (state: AppRootStateType) => state.app;
const authSelector = (state: AppRootStateType) => state.auth;
const todolistsSelector = (state: AppRootStateType) => state.todolists;
const tasksSelector = (state: AppRootStateType) => state.tasks;

export const selectStatus = createDraftSafeSelector([appSelector], (app) => app.status);
export const selectIsInitialized = createDraftSafeSelector(
  [appSelector],
  (app) => app.isInitialized
);
export const selectAppError = createDraftSafeSelector([appSelector], (app) => app.error);
export const selectIsLoggedIn = createDraftSafeSelector([authSelector], (auth) => auth.isLoggedIn);
export const selectTodolists = createDraftSafeSelector(
  [todolistsSelector],
  (todolists) => todolists
);
export const selectTasks = createDraftSafeSelector([tasksSelector], (tasks) => tasks);
