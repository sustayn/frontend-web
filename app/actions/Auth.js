import { Observable } from 'libs/rxjs';
import { push } from 'react-router-redux';

import RxAjax from 'services/RxAjax';
import { a } from 'services/authentication/actions';
import { a as flashActions } from 'services/flash/actions';
import { observableError } from 'services/flash';
import Logging from 'services/Logging';

import { genericPayload } from 'utils/normalizrHelpers';

export const successFlashMessageEpic = (action$) => {
  return action$.ofType(
    a.SIGN_IN_SUCCESS,
    a.ACTIVATE_SUCCESS,
    a.UPDATE_USER_SUCCESS,
    a.UPDATE_PASSWORD_SUCCESS,
    a.RESET_PASSWORD_SUCCESS
  )
  .mergeMap(({ message }) => Observable.of({ type: flashActions.PUSH_SUCCESS, message }));
};

export const failureFlashMessageEpic = (action$) => {
  return action$.ofType(
    a.SIGN_IN_FAILURE,
    a.REGISTER_FAILURE,
    a.ACTIVATE_FAILURE,
    a.UPDATE_USER_FAILURE,
    a.UPDATE_PASSWORD_FAILURE,
    a.RESET_PASSWORD_FAILURE
  )
  .mergeMap(({ message }) => observableError(message));
};

export const redirectToDashboardEpic = (action$) => {
  return action$.ofType(
    a.SIGN_IN_SUCCESS,
    a.ACTIVATE_SUCCESS,
    a.RESET_PASSWORD_SUCCESS
  )
  .mergeMap(() => Observable.of(push('/dashboard')));
};

export const logErrorEpic = (action$) => {
  return action$.ofType(
    a.VALIDATE_TOKEN_FAILURE,
    a.REGISTER_FAILURE,
    a.ACTIVATE_FAILURE,
    a.UPDATE_USER_FAILURE,
    a.UPDATE_PASSWORD_FAILURE,
    a.RESET_PASSWORD_FAILURE
  )
  .mergeMap(({ err }) => {
    Logging.error(err, 'Auth');
    return Observable.of({ type: 'NONE' });
  });
};

export const addDataToStoreEpic = (action$) => {
  return action$.ofType(
    a.REGISTER_SUCCESS
  )
  .map(({ res }) => genericPayload(res))
  .map((payload) => ({ type: 'NONE', payload }));
};

export default [
  successFlashMessageEpic,
  failureFlashMessageEpic,
  redirectToDashboardEpic,
  logErrorEpic,
  addDataToStoreEpic,
];