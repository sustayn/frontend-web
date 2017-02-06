import merge from 'lodash/merge';
import zipObject from 'lodash/zipObject';

import { a } from 'actions/actions';
import { genericSchema } from 'utils/normalizrHelpers';

/* note: this list needs to be updated with all entities that exist. */
export const entityList = [
  'nodes',
];
export const initialState = zipObject(entityList, entityList.map(() => ({})));

export function reducer(state = initialState, action) {
  if(action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  switch(action.type) {
    case a.NEW_NODE_TEMP_VALUE:
      const node = state.nodes[`${action.id}`];
      if(!node) return state;

      return merge({}, state, {
        nodes: {
          [`${action.id}`]: {
            temperatures: [...(node.temperatures || []), action.value],
          },
        },
      });
  }

  return state;
}