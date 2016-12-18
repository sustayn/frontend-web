import { Observable } from 'libs/rxjs';
import browserHistory from 'react-router/lib/browserHistory';

import RxAjax from 'services/RxAjax';
import { a } from 'services/authentication/actions';
import { observableError } from 'services/flash';
import parseQuery from 'utils/parseQuery';
import { AuthConfig } from 'app/config';
import { serializeJsonApiRecord } from 'utils/jsonApiHelpers';

export const onLoadEpic = (action$) => {
  return action$.ofType(a.ON_LOAD)
  .map((action) => {
    return initAuthentication();
  });
};

export const validateTokenEpic = (action$) => {
  return action$.ofType(a.VALIDATE_TOKEN)
  .mergeMap(({ headers }) => {
    return RxAjax.get('/auth/validate_token', headers)
    .flatMap((response) => {
      const currentUser = response.response.data;

      return Observable.concat(
        Observable.of({ type: a.USER_AUTHENTICATED, currentUser }),
        Observable.of({ type: a.VALIDATE_TOKEN_SUCCESS})
        );
    })
    .catch((err) => {
      return Observable.concat(
        Observable.of({ type: a.SIGN_OUT_USER }),
        Observable.of({ type: a.VALIDATE_TOKEN_FAILURE, err })
        );
    });
  });
};

export const signinEpic = (action$) => {
  return action$.ofType(a.SIGN_IN_REQ)
  .mergeMap(({ body }) => {
    return RxAjax.post('/auth/sign_in', body)
    .flatMap((response) => {
      const currentUser = response.response.data;

      return Observable.concat(
        Observable.of({ type: a.USER_AUTHENTICATED, currentUser }),
        Observable.of({ type: a.SIGN_IN_SUCCESS, message: 'Welcome back!' })
        );
    })
    .catch((err) => Observable.of({ type: a.SIGN_IN_FAILURE, err, message: 'Incorrect login information' }));
  });
};

export const registerEpic = (action$) => {
  return action$.ofType(a.REGISTER_REQ)
  .mergeMap(({ body }) => {
    const jsonApiBody = serializeJsonApiRecord({ type: 'user-registrations' }, body);
    return RxAjax.post('/auth', jsonApiBody)
    .map((res) => ({ type: a.REGISTER_SUCCESS, res, message: 'Got it! We will send an email with an invitation to Aveera!' }))
    .catch((err) => Observable.of({ type: a.REGISTER_FAILURE, err, message: 'There was an error processing your information' }));
  });
};

export const activateEpic = (action$) => {
  return action$.ofType(a.ACTIVATE_REQ)
  .mergeMap(({ body }) => {
    const confirmation_token = getConfirmationToken();
    if(!confirmation_token) return Observable.of({ type: a.ACTIVATE_FAILURE, message: 'Unable to locate a confirmation code' });
    const newBody = Object.assign({}, body, { confirmation_token });

    return RxAjax.post('/auth/activate', newBody)
    .flatMap((response) => {
      const currentUser = response.response.data;

      return Observable.concat(
        Observable.of({ type: a.USER_AUTHENTICATED, currentUser }),
        Observable.of({ type: a.ACTIVATE_SUCCESS, message: 'Welcome to Aveera!' })
        );
    })
    .catch((err) => Observable.of({ type: a.ACTIVATE_FAILURE, err, message: 'There was an error with your signup information' }));
  });
};

export const signoutEpic = (action$) => {
  return action$.ofType(a.SIGN_OUT_REQ)
  .mergeMap((action) => {
    return RxAjax.delete('/auth/sign_out')
    .flatMap((res) => {
      return Observable.concat(
        Observable.of({ type: a.SIGN_OUT_USER }),
        Observable.of({ type: a.SIGN_OUT_SUCCESS })
        );
    })
    .catch((err) => Observable.of({ type: a.SIGN_OUT_FAILURE, err }));
  });
};

export const updateUserEpic = (action$) => {
  return action$.ofType(a.UPDATE_USER_REQ)
  .mergeMap(({ attrs }) => {
    return RxAjax.put('/auth', attrs)
    .flatMap((response) => {
      const currentUser = response.response.data;

      return Observable.concat(
        Observable.of({ type: a.USER_AUTHENTICATED, currentUser }),
        Observable.of({ type: a.UPDATE_USER_SUCCESS, message: 'Your information was updated successfully' })
        );
    })
    .catch((err) => Observable.of({ type: a.UPDATE_USER_FAILURE, err, message: 'There was an error updating your settings' }));
  });
};

// Currently broken: not implemented in the backend
export const updatePasswordEpic = (action$) => {
  return action$.ofType(a.UPDATE_PASSWORD_REQ)
  .mergeMap(({ attrs }) => {
    return RxAjax.put('/auth/password', attrs)
    .flatMap((response) => {
      const currentUser = response.response.user;
      
      return Observable.concat(
        Observable.of({ type: a.USER_AUTHENTICATED, currentUser }),
        Observable.of({ type: a.UPDATE_PASSWORD_SUCCESS, message: 'Your password was updated successfully' })
        );
    })
    .catch((err) => Observable.of({ type: a.UPDATE_PASSWORD_FAILURE, err, message: 'We were unable to update your password. Please contact support' }));
  });
};

export const resetPasswordEpic = (action$) => {
  return action$.ofType(a.RESET_PASSWORD_REQ)
  .mergeMap(({ attrs }) => {
    return RxAjax.put('/auth/password', attrs)
    .flatMap((response) => {
      const currentUser = response.response.data;

      return Observable.concat(
        Observable.of({ type: a.USER_AUTHENTICATED, currentUser }),
        Observable.of({ type: a.RESET_PASSWORD_SUCCESS, message: 'Your password was reset successfully' })
        );
    })
    .catch((err) => Observable.of({ type: a.RESET_PASSWORD_FAILURE, err, message: 'We were unable to reset your password at this time. Please contact support' }));
  });
};

export const forgotPasswordEpic = (action$) => {
  return action$.ofType(a.FORGOT_PASSWORD_REQ)
  .mergeMap(({ email }) => {
    return RxAjax.post('/auth/password', { email })
    .map((response) => ({ type: a.FORGOT_PASSWORD_SUCCESS, message: 'Got it! We will send you an email with instructions for resetting your password' }))
    .catch((err) => Observable.of({ type: a.FORGOT_PASSWORD_FAILURE, err, message: 'We were unable to reset your password at this time. Please contact support' }));
  });
};

export default [
onLoadEpic,
validateTokenEpic,
signinEpic,
registerEpic,
activateEpic,
signoutEpic,
updateUserEpic,
updatePasswordEpic,
resetPasswordEpic,
forgotPasswordEpic,
];

function initAuthentication() {
  const storedExpiry = AuthConfig.storage.getItem('expiry');

  if(storedExpiry && new Date() < new Date(storedExpiry * 1000)) {
    const accessToken = AuthConfig.storage.getItem('access-token');
    const client = AuthConfig.storage.getItem('client');
    const uid = AuthConfig.storage.getItem('uid');

    if(accessToken && client && uid) {
      return {
        type:    a.VALIDATE_TOKEN,
        headers: {
          'access-token': accessToken,
          client,
          uid,
        },
      };
    }
  }
  return { type: a.SIGN_OUT_USER };
}

function getConfirmationToken() {
  if(window.location.search && window.location.pathname === AuthConfig.activateRoute) {
    const queryParams = parseQuery(window.location.search);
    return queryParams.confirmation_token;
  }
  return null;
}