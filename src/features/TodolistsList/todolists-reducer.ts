import {todolistsAPI} from 'utils/api/todolists-api';
import {appAsyncActions} from 'features/Application';
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils';
import {AxiosError} from 'axios';
import {ThunkError} from 'utils/types';
import {TodolistType} from 'utils/api/types';
import {RequestStatusType} from 'features/Application/types';
import {isGoodResp} from 'utils/helpers';

const {setAppStatusAC} = appAsyncActions;

const initialState: Array<TodolistDomainType> = [];

const removeTodolist = createAsyncThunk(
  'todolists/removeTodolist',
  async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}));
    try {
      await todolistsAPI.deleteTodolist(todolistId);
      dispatch(setAppStatusAC({status: 'succeeded'}));
      return {id: todolistId};
    } catch {
      dispatch(setAppStatusAC({status: 'failed'}));
      return rejectWithValue(null);
    }
  }
);

const addTodolist = createAsyncThunk<TodolistType, string, ThunkError>(
  'todolists/addTodolist',
  async (title, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const {data} = await todolistsAPI.createTodolist(title);
      if (isGoodResp(data)) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return data.data.item;
      } else {
        handleServerAppError(data, dispatch, false);
        return rejectWithValue({
          errors: data.messages,
          fieldsErrors: data.fieldsErrors
        });
      }
    } catch {
      dispatch(setAppStatusAC({status: 'failed'}));
      return rejectWithValue(null);
    }
  }
);

const changeTodolistTitle = createAsyncThunk(
  'todolists/changeTodolistTitle',
  async (payload: {id: string; title: string}, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await todolistsAPI.updateTodolist(payload.id, payload.title);
      if (isGoodResp(data)) {
        return payload;
      } else {
        handleServerAppError(data, dispatch);
        return rejectWithValue(null);
      }
    } catch {
      return rejectWithValue(null);
    }
  }
);

const fetchTodolists = createAsyncThunk(
  'todolists/fetchTodolists',
  async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const {data} = await todolistsAPI.getTodolists();
      dispatch(setAppStatusAC({status: 'succeeded'}));
      return {todolists: data};
    } catch (error) {
      handleServerNetworkError(error as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const asyncActions = {
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  fetchTodolists
};

export const sliceTodolist = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{id: string; filter: FilterValuesType}>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index >= 0) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{id: string; status: RequestStatusType}>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index >= 0) {
        state[index].entityStatus = action.payload.status;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index >= 0) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'});
    });
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index >= 0) {
        state[index].title = action.payload.title;
      }
    });
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle'
      }));
    });
  }
});

export const todolistsReducer = sliceTodolist.reducer;
export const {changeTodolistFilter, changeTodolistEntityStatusAC} = sliceTodolist.actions;

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
