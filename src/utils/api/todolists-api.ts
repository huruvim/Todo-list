import {
  GetTasksResponse,
  LoginParamsType,
  ResponseType,
  TaskType,
  TodolistType,
  UpdateTaskModelType
} from './types';
import { axios } from "./apiConfig";

export const todolistsAPI = {
  getTodolists() {
    return axios.get<TodolistType[]>('todo-lists');
  },
  createTodolist(title: string) {
    return axios.post<ResponseType<{item: TodolistType}>>('todo-lists', {
      title
    });
  },
  deleteTodolist(id: string) {
    return axios.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return axios.put<ResponseType>(`todo-lists/${id}`, {
      title
    });
  },
  getTasks(todolistId: string) {
    return axios.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return axios.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, taskTitile: string) {
    return axios.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {
      title: taskTitile
    });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return axios.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  }
};

export const authAPI = {
  login(data: LoginParamsType) {
    return axios.post<ResponseType<{userId?: number}>>('auth/login', data);
  },
  logout() {
    return axios.delete<ResponseType<{userId?: number}>>('auth/login');
  },
  me() {
    return axios.get<ResponseType<{id: number; email: string; login: string}>>('auth/me');
  },
  captcha() {
    return axios.get<{url: string}>('security/get-captcha-url');
  }
};
