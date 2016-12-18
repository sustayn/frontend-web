import { LOCATION_CHANGE } from 'react-router-redux';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import { a } from 'actions/actions';

export function reducer(state = {}, action) {
  switch(action.type) {
    case LOCATION_CHANGE:
      return {};
    case a.PUSH_ERRORS:
      return merge({}, state, action.payload);
    case a.REMOVE_ERROR:
      return omit(state, action.key);
    default:
      return state;
  }
}