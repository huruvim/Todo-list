import {authAPI} from '../../utils/api/todolists-api';
import {setIsLoggedInAC} from '../Auth/auth-reducer';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {InitialStateType} from './types';
import {applicationActions} from './actions';
import {isGoodResp} from '../../utils/helpers';

export const initializeApp = createAsyncThunk(
  'application/initializeApp',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const {data} = await authAPI.me();
      if (isGoodResp(data)) {
        dispatch(setIsLoggedInAC({value: true}));
      }
      dispatch(initializeApp.fulfilled);
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    status: 'idle',
    error: null,
    isInitialized: false
  } as InitialStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.isInitialized = true;
    });
    builder.addCase(applicationActions.setAppStatusAC, (state, action) => {
      state.status = action.payload.status;
    });
    builder.addCase(applicationActions.setAppErrorAC, (state, action) => {
      state.error = action.payload.error;
    });
  }
});

export const applicationReducer = applicationSlice.reducer;
