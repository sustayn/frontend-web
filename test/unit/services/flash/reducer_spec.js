import { expect } from 'chai';

import { reducer } from 'services/flash/reducer';
import { a } from 'services/flash/actions';

describe('Services | Flash | Reducer', function() {
  it('inits with an empty array', function() {
    const result = reducer(undefined, { type: 'NONE' });
    expect(result).to.deep.equal([]);
  });

  it('can push to queue', function() {
    const result = reducer([1], { type: a.PUSH_TO_QUEUE, flashObject: 2 });
    expect(result).to.deep.equal([1, 2]);
  });

  it('can pop from queue', function() {
    const result = reducer([1,2,3], { type: a.POP_FROM_QUEUE });
    expect(result).to.deep.equal([2, 3]);
  });
});