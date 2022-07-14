import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from "./combiner";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
});

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.store = store;
}
