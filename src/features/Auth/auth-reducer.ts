import {appAsyncActions} from '../Application';
import {authAPI} from 'utils/api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils';
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {ThunkError} from 'utils/types';
import {LoginParamsType} from 'utils/api/types';
import {isGoodResp} from 'utils/helpers';

export const login = createAsyncThunk<{isLoggedIn: boolean}, LoginParamsType, ThunkError>(
  'auth/login',
  async (payload, {dispatch, rejectWithValue}) => {
    dispatch(appAsyncActions.setAppStatusAC({status: 'loading'}));
    try {
      const {data} = await authAPI.login(payload);
      if (isGoodResp(data)) {
        dispatch(appAsyncActions.setAppStatusAC({status: 'succeeded'}));
        return {isLoggedIn: true};
      } else if (data.resultCode === 10) {
        handleServerAppError(data, dispatch);
        const {data: captchaData} = await authAPI.captcha();
        return rejectWithValue({
          errors: [],
          fieldsErrors: [{field: 'captcha', error: captchaData.url}]
        });
      } else {
        handleServerAppError(data, dispatch);
        return rejectWithValue({
          errors: data.messages,
          fieldsErrors: data.fieldsErrors
        });
      }
    } catch (error) {
      handleServerNetworkError(error as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, {dispatch, rejectWithValue}) => {
  dispatch(appAsyncActions.setAppStatusAC({status: 'loading'}));
  try {
    const {data} = await authAPI.logout();
    if (isGoodResp(data)) {
      dispatch(appAsyncActions.setAppStatusAC({status: 'succeeded'}));
      return {isLoggedIn: false};
    } else {
      handleServerAppError(data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, dispatch);
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
      state.isLoggedIn = action.payload.value;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  }
});

export const {setIsLoggedInAC} = authSlice.actions;
export const authReducer = authSlice.reducer;
