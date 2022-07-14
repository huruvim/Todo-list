import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Grid} from '@material-ui/core';
import {AddItemForm} from 'components/business/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Redirect} from 'react-router-dom';
import {todolistsActions} from './index';
import {useActions, useAppDispatch} from 'utils/redux-utils';
import {selectIsLoggedIn, selectTasks, selectTodolists} from 'redux/selectors';

type PropsType = {
  demo?: boolean;
};

export type AddItemHelpers = {
  setError: (error: string) => void;
  setTitle: (title: string) => void;
};

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {fetchTodolists} = useActions(todolistsActions);
  const dispatch = useAppDispatch();

  const onAddTodoList = useCallback(async (title: string, {setTitle, setError}: AddItemHelpers) => {
    const thunk = todolistsActions.addTodolist(title);
    const action = await dispatch(thunk);
    if (todolistsActions.addTodolist.rejected.match(action)) {
      if (action.payload?.errors?.length) {
        const errorMessage = action.payload?.errors[0];
        setError(errorMessage);
      } else {
        setError('Some error occurred');
      }
    } else {
      setTitle('');
    }
  }, []);

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  if (!isLoggedIn) {
    return <Redirect to={'/login'} />;
  }

  return (
    <>
      <Grid container style={{padding: '20px'}}>
        <AddItemForm addItem={onAddTodoList} />
      </Grid>
      <Grid container spacing={3} wrap="nowrap" style={{overflowX: 'auto'}}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Todolist todolist={tl} tasks={tasks[tl.id]} demo={demo} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
