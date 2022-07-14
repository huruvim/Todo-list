import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {todolistsAPI} from '../../utils/api/todolists-api';
import {asyncActions as todolistsAsyncActions} from './todolists-reducer';
import {appAsyncActions} from '../Application';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {AppRootStateType, ThunkError} from '../../utils/types';
import {TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from '../../utils/api/types';
import {isGoodResp} from '../../utils/helpers';

const {setAppStatusAC} = appAsyncActions;

const initialState: TasksStateType = {};

const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {dispatch}) => {
  dispatch(setAppStatusAC({status: 'loading'}));
  const {data} = await todolistsAPI.getTasks(todolistId);
  dispatch(setAppStatusAC({status: 'succeeded'}));
  return {tasks: data.items, todolistId};
});

const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (payload: {taskId: string; todolistId: string}) => {
    await todolistsAPI.deleteTask(payload.todolistId, payload.taskId);
    return payload;
  }
);

const addTask = createAsyncThunk<TaskType, {title: string; todolistId: string}, ThunkError>(
  'tasks/addTask',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      const {data} = await todolistsAPI.createTask(payload.todolistId, payload.title);
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
    } catch (error) {
      handleServerNetworkError(error as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  }
);

const updateTask = createAsyncThunk<UpdateTask, UpdateTask>(
  'tasks/updateTask',
  async ({taskId, todolistId, model}, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      return rejectWithValue(null);
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...model
    };
    try {
      const {data} = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
      if (isGoodResp(data)) {
        return {taskId, model, todolistId};
      } else {
        handleServerAppError(data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const asyncActions = {updateTask, addTask, removeTask, fetchTasks};

const sliceTasks = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(todolistsAsyncActions.addTodolist.fulfilled, (state, action) => {
      state[action.payload.id] = [];
    });
    builder.addCase(todolistsAsyncActions.removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(todolistsAsyncActions.fetchTodolists.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index) {
        tasks[index] = {...tasks[index], ...action.payload.model};
      }
    });
  }
});

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

interface UpdateTask {
  taskId: string;
  model: UpdateDomainTaskModelType;
  todolistId: string;
}

export const tasksReducer = sliceTasks.reducer;
