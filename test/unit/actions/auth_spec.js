import { expect } from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs/Observable';
import jsdom from 'jsdom';
import merge from 'lodash/merge';

import getEpicResults from 'test/helpers/getEpicResults';
import { expectFlashSuccessAction, expectFlashErrorAction} from 'test/helpers/flashHelpers';
import { expectRedirectActionTo } from 'test/helpers/routerHelpers';
import {
  successFlashMessageEpic,
  failureFlashMessageEpic,
  redirectToDashboardEpic,
  logErrorEpic,
  addDataToStoreEpic,
} from 'actions/Auth';
import { a } from 'services/authentication/actions';
import RxAjax from 'services/RxAjax';
import Logging from 'services/Logging';

describe('Actions | Auth', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    this.sandbox.restore();
  });

  describe('successFlashMessageEpic', function() {
    it('listens to desired success actions', function() {
      const ofTypeStub = this.sandbox.stub().returns(Observable.of({}));
      successFlashMessageEpic({ ofType: ofTypeStub }).subscribe(x => {});

      expect(ofTypeStub.args[0]).to.deep.equal([
        a.SIGN_IN_SUCCESS,
        a.ACTIVATE_SUCCESS,
        a.UPDATE_USER_SUCCESS,
        a.UPDATE_PASSWORD_SUCCESS,
        a.RESET_PASSWORD_SUCCESS,
      ]);
    });

    it('dispatches a flash message for success', function() {
      const result = getEpicResults(successFlashMessageEpic)[0];
      expectFlashSuccessAction(result);
    });
  });

  describe('failureFlashMessageEpic', function() {
    it('listens to all failure actions', function() {
      const ofTypeStub = this.sandbox.stub().returns(Observable.of({}));
      failureFlashMessageEpic({ ofType: ofTypeStub }).subscribe(x => {});

      expect(ofTypeStub.args[0]).to.deep.equal([
        a.SIGN_IN_FAILURE,
        a.REGISTER_FAILURE,
        a.ACTIVATE_FAILURE,
        a.UPDATE_USER_FAILURE,
        a.UPDATE_PASSWORD_FAILURE,
        a.RESET_PASSWORD_FAILURE,
      ]);
    });

    it('dispatches a flash message on error', function() {
      const result = getEpicResults(failureFlashMessageEpic)[0];
      expectFlashErrorAction(result);
    })
  });

  describe('redirectToDashboardEpic', function() {
    it('listens to the desired actions', function() {
      const ofTypeStub = this.sandbox.stub().returns(Observable.of({}));
      redirectToDashboardEpic({ ofType: ofTypeStub }).subscribe(x => {});

      expect(ofTypeStub.args[0]).to.deep.equal([
        a.SIGN_IN_SUCCESS,
        a.ACTIVATE_SUCCESS,
        a.RESET_PASSWORD_SUCCESS,
      ]);
    });

    it('redirects to dashboard', function() {
      const result = getEpicResults(redirectToDashboardEpic)[0];
      expectRedirectActionTo(result, '/dashboard');
    });
  });

  describe('logErrorEpic', function() {
    it('listens to the desired actions', function() {
      this.sandbox.stub(Logging, 'error');
      const ofTypeStub = this.sandbox.stub().returns(Observable.of({}));
      logErrorEpic({ ofType: ofTypeStub }).subscribe(x => {});

      expect(ofTypeStub.args[0]).to.deep.equal([
        a.VALIDATE_TOKEN_FAILURE,
        a.REGISTER_FAILURE,
        a.ACTIVATE_FAILURE,
        a.UPDATE_USER_FAILURE,
        a.UPDATE_PASSWORD_FAILURE,
        a.RESET_PASSWORD_FAILURE,
      ]);
    });

    it('calls the Logging service to log errors', function() {
      const loggingStub = this.sandbox.stub(Logging, 'error');
      const err = 'My Error';

      getEpicResults(logErrorEpic, { err });

      expect(loggingStub.args[0][0]).to.equal(err);
      expect(loggingStub.args[0][1]).to.equal('Auth');
    });
  });

  describe('addDataToStoreEpic', function() {
    it('listens to the desired actions', function() {
      const ofTypeStub = this.sandbox.stub().returns(Observable.of({ res: { response: {} } }));
      addDataToStoreEpic({ ofType: ofTypeStub }).subscribe(x => {});

      expect(ofTypeStub.args[0]).to.deep.equal([
        a.REGISTER_SUCCESS,
      ]);
    });

    it('dispatches the normalized payload', function() {
      const regId = 1;
      const userId = 42;
      const firstName = 'Jake';
      const lastName = 'Dluhy';
      const email = 'jake@example.com';
      const response = {
        data: {
          id: regId,
          type: 'user-registrations',
          attributes: { email },
          relationships: {
            user: {
              data: { id: userId, type: 'users' },
            },
          },
        },
        included: [{
          id: userId,
          type: 'users',
          attributes: { 'first-name': firstName, 'last-name': lastName, email },
          relationships: {
            'user-registration': {
              data: { id: regId, type: 'user-registrations' },
            },
          },
        }],
      };

      const result = getEpicResults(addDataToStoreEpic, { res: { response } })[0];
      expect(result.payload.entities).to.deep.equal({
        users: {
          [userId]: {
            id: userId,
            type: 'users',
            firstName,
            lastName,
            email,
            userRegistration: regId,
          },
        },
      });
    });
  });
});