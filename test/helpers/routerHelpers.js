import { expect } from 'chai';
import { CALL_HISTORY_METHOD } from 'react-router-redux';

export function expectRedirectActionTo(action, url) {
    expect(action.type).to.equal(CALL_HISTORY_METHOD);
    expect(action.payload.method).to.equal('push');
    expect(action.payload.args).to.deep.equal([url]);
}