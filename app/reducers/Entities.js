import merge from 'lodash/merge';
import zipObject from 'lodash/zipObject';

import { genericSchema } from 'utils/normalizrHelpers';

/* note: this list needs to be updated with all entities that exist. */
export const entityList = [
  'users',
];
export const initialState = zipObject(entityList, entityList.map(() => ({})));

export function reducer(state = initialState, action) {
  if(action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  return state;
}

