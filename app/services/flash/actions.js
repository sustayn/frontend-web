import makeActionCreator from 'utils/makeActionCreator.js';

export const a = {
  PUSH_TO_QUEUE:  'PUSH_TO_QUEUE',
  POP_FROM_QUEUE: 'POP_FROM_QUEUE',
  PUSH_ERROR:     'PUSH_ERROR',
  PUSH_SUCCESS:   'PUSH_SUCCESS',
  PUSH_WARNING:   'PUSH_WARNING',
};

export const pushFlash = makeActionCreator(a.PUSH_TO_QUEUE, 'flashObject', 'duration');
export const dismissFlash = makeActionCreator(a.POP_FROM_QUEUE);
export const pushFlashError = makeActionCreator(a.PUSH_ERROR, 'message');
export const pushFlashSuccess = makeActionCreator(a.PUSH_SUCCESS, 'message');
export const pushFlashWarning = makeActionCreator(a.PUSH_WARNING, 'message');
