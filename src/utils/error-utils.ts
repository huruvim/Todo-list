import {appAsyncActions} from 'features/Application';
import {Dispatch} from 'redux';
import {AxiosError} from 'axios';
import {ResponseType} from './api/types';

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch,
  showError = true
) => {
  if (showError) {
    dispatch(
      appAsyncActions.setAppErrorAC({
        error: data.messages.length ? data.messages[0] : 'Some error occurred'
      })
    );
  }
  dispatch(appAsyncActions.setAppStatusAC({status: 'failed'}));
};

export const handleServerNetworkError = (
  error: AxiosError,
  dispatch: Dispatch,
  showError = true
) => {
  if (showError) {
    dispatch(
      appAsyncActions.setAppErrorAC({
        error: error.message ?? 'Some error occurred'
      })
    );
  }
  dispatch(appAsyncActions.setAppStatusAC({status: 'failed'}));
};
