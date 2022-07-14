import { combineReducers } from "redux";
import { tasksReducer, todolistsReducer } from "../features/TodolistsList";
import { applicationReducer } from "../features/Application";
import { authReducer } from "../features/Auth";

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: applicationReducer,
  auth: authReducer
});
