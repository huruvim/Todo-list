import React, {useCallback, useEffect} from 'react';
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TodolistsList} from 'features/TodolistsList';
import {ErrorSnackbar} from 'components/business/ErrorSnackbar';
import {useDispatch, useSelector} from 'react-redux';
import {appActions} from 'features/Application';
import {Route} from 'react-router-dom';
import {Login} from 'features/Auth';
import {logout} from 'features/Auth/auth-reducer';
import {selectIsInitialized, selectIsLoggedIn, selectStatus} from 'redux/selectors';

export const App: React.FC = () => {
  const status = useSelector(selectStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isInitialized) {
      dispatch(appActions.initializeApp());
    }
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(logout());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Route exact path={'/'} render={() => <TodolistsList demo={false} />} />
        <Route path={'/login'} render={() => <Login />} />
      </Container>
    </div>
  );
};
