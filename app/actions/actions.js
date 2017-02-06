import makeActionCreator from 'utils/makeActionCreator.js';

export const a = {
  // Form Errors
  PUSH_ERRORS:  'PUSH_ERRORS',
  REMOVE_ERROR: 'REMOVE_ERROR',

  // Channels
  FIND_NODE_REQ:       'FIND_NODE_REQ',
  FIND_NODE_RES:       'FIND_NODE_RES',
  OPEN_NODE_CHANNEL:   'OPEN_NODE_CHANNEL',
  CLOSE_NODE_CHANNEL:  'CLOSE_NODE_CHANNEL',
  NODE_DATA_RECEIVED:  'NODE_DATA_RECEIVED',
  NEW_NODE_TEMP_VALUE: 'NEW_NODE_TEMP_VALUE',
};

export const pushErrors =  makeActionCreator(a.PUSH_ERRORS, 'payload');
export const removeError = makeActionCreator(a.REMOVE_ERROR, 'key');

export const findNodeReq = makeActionCreator(a.FIND_NODE_REQ, 'id', 'query');
export const openNodeChannel = makeActionCreator(a.OPEN_NODE_CHANNEL, 'id');
export const closeNodeChannel = makeActionCreator(a.CLOSE_NODE_CHANNEL, 'id');
export const nodeDataReceived = makeActionCreator(a.NODE_DATA_RECEIVED, 'payload');
export const newNodeTempValue = makeActionCreator(a.NEW_NODE_TEMP_VALUE, 'id', 'value');