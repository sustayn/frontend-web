import makeActionCreator from 'utils/makeActionCreator.js';

export const a = {
    // Form Errors
    PUSH_ERRORS:  'PUSH_ERRORS',
    REMOVE_ERROR: 'REMOVE_ERROR',
};

export const pushErrors =  makeActionCreator(a.PUSH_ERRORS, 'payload');
export const removeError = makeActionCreator(a.REMOVE_ERROR, 'key');