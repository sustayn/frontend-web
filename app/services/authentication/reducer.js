import { a } from 'services/authentication/actions';

import { AuthConfig } from 'app/config';
import RxAjax from 'services/RxAjax';
import camelizeKeys from 'utils/camelizeKeys';

const init = () => ({
  isAuthenticated: !!AuthConfig.storage.getItem('access-token'),
  currentUser:     JSON.parse(AuthConfig.storage.getItem('currentUser') || '{}'),
});

export function reducer(state = init(), action) {
  switch(action.type) {
    case a.USER_AUTHENTICATED:
      const currentUser2 = camelizeKeys(action.currentUser);
      AuthConfig.storage.setItem('currentUser', JSON.stringify(currentUser2));
      return { ...state, isAuthenticated: true, currentUser: currentUser2 };
    case a.SIGN_OUT_USER:
      if (AuthConfig.autoLogin) {
        return { ...state };
      } else {
        removeStoredHeaders();
        return { ...state, isAuthenticated: false, currentUser: {} };
      }
    default:
      return state;
  }
}

function removeStoredHeaders(storage) {
  RxAjax.resetHeaders();
  ['access-token', 'client', 'expiry', 'uid', 'currentUser'].forEach((key) => {
    AuthConfig.storage.removeItem(key);
  });
}
