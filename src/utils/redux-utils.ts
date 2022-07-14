import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatchType } from './types';

export const useAppDispatch = () => useDispatch<AppDispatchType>();

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
  const dispatch = useAppDispatch();
  return useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, [dispatch, actions]);
};
