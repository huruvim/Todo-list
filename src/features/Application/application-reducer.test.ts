import {InitialStateType} from './types';
import {applicationActions} from './actions';
import {applicationReducer} from './application-reducer';

const {setAppStatusAC, setAppErrorAC} = applicationActions;

describe('app-reducer:', () => {
  let startState: InitialStateType;
  beforeEach(() => {
    startState = {
      error: null,
      status: 'idle',
      isInitialized: false
    };
  });
  test('correct error message should be set', () => {
    const endState = applicationReducer(startState, setAppErrorAC({error: 'some error'}));
    expect(endState.error).toBe('some error');
  });
  test('correct status should be set', () => {
    const endState = applicationReducer(startState, setAppStatusAC({status: 'loading'}));
    expect(endState.status).toBe('loading');
  });
});
