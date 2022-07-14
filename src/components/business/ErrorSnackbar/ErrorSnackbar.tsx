import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {appAsyncActions} from 'features/Application';
import {useActions} from 'utils/redux-utils';
import {selectAppError} from 'redux/selectors';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export const ErrorSnackbar = () => {
  const error = useSelector(selectAppError);
  const dispatch = useDispatch();
  const {setAppErrorAC} = useActions(appAsyncActions);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setAppErrorAC({error: null}));
  };

  return (
    <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  );
};
