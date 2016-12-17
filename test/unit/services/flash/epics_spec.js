import { expect } from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs/Observable';
import getEpicResults from '../../../helpers/getEpicResults';

import {
    flashPushEpic,
    flashErrorEpic,
    flashSuccessEpic,
    flashWarningEpic,
} from 'services/flash/epics';
import { a } from 'services/flash/actions';

describe('Service | Flash | Epics', function() {
    describe.skip('flashPushEpic', function() {
        it('emits a POP every 3 seconds, one after the other', function() {

        });

        it('will cancel the delayed POP if another POP is called', function() {

        });

        it('will emit a POP after 3 seconds if a POP is manually called', function() {

        });
    });

    it('flashErrorEpic dispatches a PUSH_TO_QUEUE with an error flashObject', function() {
        const message = 'test';
        const result = getEpicResults(flashErrorEpic, { message })[0];
        expect(result).to.deep.equal({
            type: a.PUSH_TO_QUEUE,
            flashObject: {
                type: 'error',
                message
            }
        });
    });

    it('flashSuccessEpic dispatches a PUSH_TO_QUEUE with a success flashObject', function() {
        const message = 'test';
        const result = getEpicResults(flashSuccessEpic, { message })[0];
        expect(result).to.deep.equal({
            type: a.PUSH_TO_QUEUE,
            flashObject: {
                type: 'success',
                message
            }
        });
    });

    it('flashWarningEpic dispatches a PUSH_TO_QUEUE with a warning flashObject', function() {
        const message = 'test';
        const result = getEpicResults(flashWarningEpic, { message })[0];
        expect(result).to.deep.equal({
            type: a.PUSH_TO_QUEUE,
            flashObject: {
                type: 'warning',
                message
            }
        });
    });
});