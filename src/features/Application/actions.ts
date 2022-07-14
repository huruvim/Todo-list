import {createAction} from '@reduxjs/toolkit';
import {RequestStatusType} from './types';

const setAppStatusAC = createAction<{status: RequestStatusType}>('application/setAppStatusAC');
const setAppErrorAC = createAction<{error: string | null}>('application/setAppErrorAC');

export const applicationActions = {
  setAppStatusAC,
  setAppErrorAC
};
