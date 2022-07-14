import {store} from '../redux/store';
import {FieldErrorType} from './api/types';
import { rootReducer } from "redux/combiner";

export type RootReducerType = typeof rootReducer;
export type AppRootStateType = ReturnType<RootReducerType>;
export type AppDispatchType = typeof store.dispatch;
export type ThunkError = {
  rejectValue: {
    errors: Array<string>;
    fieldsErrors?: Array<FieldErrorType>;
  } | null;
};
