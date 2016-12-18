import merge from 'lodash/merge';

import { a as authActions } from 'services/authentication/actions';

export function signInUser(store, attrs) {
  store.dispatch({
    type:        authActions.USER_AUTHENTICATED,
    currentUser: merge({
      firstName: 'Jacob Robert Deems Dluhy',
      lastName:  'Dluhy',
      email:     'jake@example.com',
    }, attrs),
  });
}