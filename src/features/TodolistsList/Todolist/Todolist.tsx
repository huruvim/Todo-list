import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from 'components/business/AddItemForm/AddItemForm';
import {EditableSpan} from 'components/business/EditableSpan/EditableSpan';
import {Button, IconButton, Paper} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task/Task';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import {tasksActions, todolistsActions} from '../index';
import {AddItemHelpers} from '../TodolistsList';
import {useActions, useAppDispatch} from 'utils/redux-utils';
import {TaskStatuses, TaskType} from 'utils/api/types';
import {isEmpty} from '../../../utils/helpers';

interface TodolistProps {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
}

export const Todolist: React.FC<TodolistProps> = React.memo(({demo = false, todolist, tasks}) => {
  const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions);
  const {fetchTasks} = useActions(tasksActions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(todolist.id);
  }, []);

  const onAddTask = useCallback(
    async (title: string, {setTitle, setError}: AddItemHelpers) => {
      const thunk = tasksActions.addTask({title, todolistId: todolist.id});
      const action = await dispatch(thunk);
      if (tasksActions.addTask.rejected.match(action)) {
        if (action.payload?.errors?.length) {
          const errorMessage = action.payload?.errors[0];
          setError(errorMessage);
        } else {
          setError('Some error occurred');
        }
      } else {
        setTitle('');
      }
    },
    [todolist.id]
  );

  const onRemoveTodolist = () => {
    removeTodolist(todolist.id);
  };
  const onChangeTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({id: todolist.id, title});
    },
    [todolist.id]
  );

  const onFilterChange = useCallback(
    (filter: FilterValuesType) => {
      changeTodolistFilter({filter, id: todolist.id});
    },
    [todolist.id]
  );

  let tasksForTodolist = tasks;

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <Paper style={{padding: '10px', width: '300px', position: 'relative'}}>
      <h3 style={{maxWidth: '250px'}}>
        <EditableSpan value={todolist.title} onChange={onChangeTodolistTitle} />
        <IconButton
          onClick={onRemoveTodolist}
          disabled={todolist.entityStatus === 'loading'}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px'
          }}>
          <Delete fontSize="small" />
        </IconButton>
      </h3>
      <AddItemForm addItem={onAddTask} disabled={todolist.entityStatus === 'loading'} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
        {isEmpty(tasksForTodolist) && <div style={{padding: '10px', color: 'grey'}}>No tasks</div>}
      </div>
      <div style={{paddingTop: '10px'}}>
        <Button
          variant={todolist.filter === 'all' ? 'outlined' : 'text'}
          onClick={() => onFilterChange('all')}
          color={'default'}>
          All
        </Button>
        <Button
          variant={todolist.filter === 'active' ? 'outlined' : 'text'}
          onClick={() => onFilterChange('active')}
          color={'primary'}>
          Active
        </Button>
        <Button
          variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
          onClick={() => onFilterChange('completed')}
          color={'secondary'}>
          Completed
        </Button>
      </div>
    </Paper>
  );
});
