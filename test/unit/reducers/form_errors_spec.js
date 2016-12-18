import { expect } from 'chai';
import { LOCATION_CHANGE } from 'react-router-redux';

import { reducer } from 'reducers/FormErrors';
import { a } from 'actions/actions';

describe('Reducers | FormErrors', function() {
  describe('the reducer', function() {
    it('returns an empty object on initialization', function() {
      expect(reducer(undefined, {})).to.deep.equal({});
    });

    it('clears on LOCATION_CHANGE', function() {
      const action = { type: LOCATION_CHANGE };
      const state = { firstName: 'error' };

      expect(reducer(state, action)).to.deep.equal({});
    });

    it('merges the action payload with the existing error state with PUSH_ERRORS', function() {
      const payload = { lastName: 'error' };
      const action = { type: a.PUSH_ERRORS, payload };
      const state = { firstName: 'error2' };

      expect(reducer(state, action)).to.deep.equal({ ...state, ...payload });
    });

    it('removes the action specified key from the error state with REMOVE_ERROR', function() {
      const key = 'firstName';
      const action = { type: a.REMOVE_ERROR, key };
      const state = { [key]: 'error' };

      expect(reducer(state, action)).to.deep.equal({});
    });
  });
});