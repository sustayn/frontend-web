import { expect } from 'chai';

import observableError from 'services/flash/observableError';
import { a } from 'services/flash/actions';

describe('Services | Flash | observableError', function() {
    it('should return an observable that emits a PUSH_TO_QUEUE action', function() {
        const message = 'test';
        let result;
        observableError(message).subscribe(x => { result = x });

        expect(result).to.deep.equal({
            type: a.PUSH_TO_QUEUE,
            flashObject: {
                message,
                type: 'error'
            }
        });
    });
});