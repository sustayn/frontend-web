import makeActionCreator from 'utils/makeActionCreator';

export const a = {
  ON_LOAD:                 'ON_LOAD',
  VALIDATE_TOKEN:          'VALIDATE_TOKEN',
  USER_AUTHENTICATED:      'USER_AUTHENTICATED',
  SIGN_IN_REQ:             'SIGN_IN_REQ',
  REGISTER_REQ:            'REGISTER_REQ',
  ACTIVATE_REQ:            'ACTIVATE_REQ',
  SIGN_OUT_REQ:            'SIGN_OUT_REQ',
  SIGN_OUT_USER:           'SIGN_OUT_USER',
  UPDATE_USER_REQ:         'UPDATE_USER_REQ',
  UPDATE_PASSWORD_REQ:     'UPDATE_PASSWORD_REQ',
  RESET_PASSWORD_REQ:      'RESET_PASSWORD_REQ',
  FORGOT_PASSWORD_REQ:     'FORGOT_PASSWORD_REQ',
  VALIDATE_TOKEN_SUCCESS:  'VALIDATE_TOKEN_SUCCESS',
  VALIDATE_TOKEN_FAILURE:  'VALIDATE_TOKEN_FAILURE',
  SIGN_IN_SUCCESS:         'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE:         'SIGN_IN_FAILURE',
  REGISTER_SUCCESS:        'REGISTER_SUCCESS',
  REGISTER_FAILURE:        'REGISTER_FAILURE',
  ACTIVATE_SUCCESS:        'ACTIVATE_SUCCESS',
  ACTIVATE_FAILURE:        'ACTIVATE_FAILURE',
  SIGN_OUT_SUCCESS:        'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE:        'SIGN_OUT_FAILURE',
  UPDATE_USER_SUCCESS:     'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE:     'UPDATE_USER_FAILURE',
  UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS',
  UPDATE_PASSWORD_FAILURE: 'UPDATE_PASSWORD_FAILURE',
  RESET_PASSWORD_SUCCESS:  'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILURE:  'RESET_PASSWORD_FAILURE',
  FORGOT_PASSWORD_SUCCESS: 'FORGOT_PASSWORD_SUCCESS',
  FORGOT_PASSWORD_FAILURE: 'FORGOT_PASSWORD_FAILURE',
};

export const onLoad = makeActionCreator(a.ON_LOAD);
export const validateToken = makeActionCreator(a.VALIDATE_TOKEN, 'headers');
export const userAuthenticated = makeActionCreator(a.USER_AUTHENTICATED, 'currentUser');
export const signInReq = makeActionCreator(a.SIGN_IN_REQ, 'body');
export const registerReq = makeActionCreator(a.REGISTER_REQ, 'body');
export const activateReq = makeActionCreator(a.ACTIVATE_REQ, 'body');
export const signOutReq = makeActionCreator(a.SIGN_OUT_REQ);
export const updateUserReq = makeActionCreator(a.UPDATE_USER_REQ, 'attrs');
export const updatePasswordReq = makeActionCreator(a.UPDATE_PASSWORD_REQ, 'attrs');
export const resetPasswordReq = makeActionCreator(a.RESET_PASSWORD_REQ, 'attrs');
export const forgotPasswordReq = makeActionCreator(a.FORGOT_PASSWORD_REQ, 'email');