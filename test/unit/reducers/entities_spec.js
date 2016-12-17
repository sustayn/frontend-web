import { expect } from 'chai';
import cloneDeep from 'lodash/cloneDeep';

import {
    initialState,
    reducer,
    getEntitySelector,
    idSelector,
} from 'reducers/Entities';

describe('Reducers | Entities', function() {
    describe('the reducer', function() {
        it('returns the initialState entities object when state is not passed in', function() {
            expect(reducer(undefined, {})).to.deep.equal(initialState);
        });

        it('returns the state if the payload does not have an entities key', function() {
            const state = { accounts: {} };
            const action = { payload: { something: 'random' } };

            expect(reducer(state, action)).to.deep.equal(state);
        });

        it('merges state with the payload entities without mutating', function() {
            const state = { accounts: {} };
            const action = { payload: { entities: { careTeams: {} } } };
            const expectedResponse = {
                accounts: {},
                careTeams: {},
            };

            const response = reducer(state, action);
            expect(response).to.deep.equal(expectedResponse);
            expect(response).to.not.deep.equal(state);
        });
    });
});