import { expect } from 'chai';
import { a } from 'services/flash/actions';

export function expectSuccessFlash(wrapper, message) {
    expectFlash(wrapper, message, 'success');
};

export function expectWarningFlash(wrapper, message) {
    expectFlash(wrapper, message, 'warning');
};

export function expectErrorFlash(wrapper, message) {
    expectFlash(wrapper, message, 'error');
};

function expectFlash(wrapper, message, type) {
    const flashWrapper = wrapper.find('.spec-flash-wrapper');
    expect(flashWrapper.length).to.equal(1);
    expect(flashWrapper.hasClass(`is-${type}`)).to.be.true;
    expect(flashWrapper.find('.spec-flash-message').text()).to.equal(message);
};

export function popFromQueue(store) {
    store.dispatch({ type: a.POP_FROM_QUEUE });
}

export function expectFlashErrorAction(action) {
    expect(action.type).to.equal(a.PUSH_TO_QUEUE);
    expect(action.flashObject.type).to.equal('error');
}

export function expectFlashSuccessAction(action) {
    expect(action.type).to.equal(a.PUSH_SUCCESS);
    expect(action.message).to.not.be.null;
}