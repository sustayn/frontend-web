import merge from 'lodash/merge';

import { genericSchema } from 'utils/normalizrHelpers';

/* note: this list needs to be updated with all entities that exist. */
export const initialState = {
    users:      {},
};

export function reducer(state = initialState, action) {
    if(action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities);
    }
    return state;
}

export const entityList = [
    'users',
];