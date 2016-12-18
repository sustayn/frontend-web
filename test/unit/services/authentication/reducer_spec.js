import { expect } from 'chai';
import sinon from 'sinon';

import { reducer } from 'services/authentication/reducer';
import { a } from 'services/authentication/actions';
import camelizeKeys from 'utils/camelizeKeys';
import RxAjax from 'services/RxAjax';
import { AuthConfig } from 'app/config';

describe('Service | Authentication | Reducer ', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    this.sandbox.restore();
  });

  describe('on init', function() {
    it('returns an unauthenticated state', function() {
      const storageStub = this.sandbox.stub(AuthConfig.storage, 'getItem').returns(null);

      const resultState = reducer(undefined, { type: 'NONE' });
      expect(resultState.isAuthenticated).to.be.false
      expect(resultState.currentUser).to.deep.equal({});
    });

    it('returns an authenticated state', function() {
      const currentUser = { name: 'Jake' };
      const storageStub = this.sandbox.stub(AuthConfig.storage, 'getItem').withArgs('access-token').returns('123abc');
      storageStub.withArgs('currentUser').returns(JSON.stringify(currentUser));

      const resultState = reducer(undefined, { type: 'NONE' });
      expect(resultState.isAuthenticated).to.be.true;
      expect(resultState.currentUser).to.deep.equal(currentUser);
    });
  });

  describe('USER_AUTHENTICATED', function() {
    it('camelizes the current user keys', function() {
      const currentUser = { first_name: 'Jake' };

      const resultState = reducer(undefined, { type: a.USER_AUTHENTICATED, currentUser });
      expect(resultState.currentUser).to.deep.equal({ firstName: 'Jake' });
    });

    it('calls setItem on storage with the currentUser object', function() {
      const storageStub = this.sandbox.stub(AuthConfig.storage, 'setItem');
      const currentUser = { name: 'Jake' };

      reducer(undefined, { type: a.USER_AUTHENTICATED, currentUser });
      expect(storageStub.calledWithExactly('currentUser', JSON.stringify(currentUser))).to.be.true;
    });

    it('return an authenticated state', function() {
      const currentUser = { name: 'Jake' };

      const resultState = reducer(undefined, { type: a.USER_AUTHENTICATED, currentUser });
      expect(resultState.isAuthenticated).to.be.true;
      expect(resultState.currentUser).to.deep.equal(currentUser);
    });
  });

  describe('SIGN_OUT_USER', function() {
    it('calls removeStoredHeaders which resets the header data', function() {
      const spy = sinon.spy();
      const storageStub = this.sandbox.stub(AuthConfig.storage, 'removeItem');
      RxAjax.resetHeaders = spy;

      reducer(undefined, { type: a.SIGN_OUT_USER });
      expect(spy.calledOnce).to.be.true;
      expect(storageStub.getCall(0).args[0]).to.equal('access-token');
      expect(storageStub.getCall(1).args[0]).to.equal('client');
      expect(storageStub.getCall(2).args[0]).to.equal('expiry');
      expect(storageStub.getCall(3).args[0]).to.equal('uid');
      expect(storageStub.getCall(4).args[0]).to.equal('currentUser');
    });

    it('returns an unauthenticated state', function() {
      const resultState = reducer(undefined, { type: a.SIGN_OUT_USER });
      expect(resultState.isAuthenticated).to.be.false;
      expect(resultState.currentUser).to.deep.equal({});
    });
  });
});