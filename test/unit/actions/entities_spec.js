import { expect } from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs/Observable';
import merge from 'lodash/merge';

import getEpicResults from 'test/helpers/getEpicResults';
import { expectFlashSuccessAction, expectFlashErrorAction } from 'test/helpers/flashHelpers';
import { expectRedirectActionTo } from 'test/helpers/routerHelpers';
import {
  makeFetchEpic,
  makeFindEpic,
  makeCreateEpic,
} from 'actions/Entities';
import { a } from 'actions/actions';
import RxAjax from 'services/RxAjax';
import Logging from 'services/Logging';

describe('Actions | Entities', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
    this.name = 'My Care Team';
    this.id = 1;
    this.jsonApiResponse = {
      data: {
        id: this.id,
        type: 'users',
        attributes: {
          name: this.name,
        },
      },
    };
  });
  afterEach(function() {
    this.sandbox.restore();
  });

  describe('makeFetchEpic creating fetch epic for user', function() {
    beforeEach(function() {
      this.fetchUsersEpic = makeFetchEpic('users');
      this.users = [{ id: 1, name: 'CT1' }, { id: 2, name: 'CT2' }];
      this.multiJsonApiResponse = {
        data: this.users.map((ct) => ({
          id: ct.id,
          type: 'users',
          attributes: { name: ct.name },
        })),
      };
    });

    it('sends a GET request to /users', function() {
      const ajaxStub = this.sandbox.stub(RxAjax, 'get').returns(Observable.of({ response: this.jsonApiResponse }));

      getEpicResults(this.fetchUsersEpic);
      expect(ajaxStub.args[0][0]).to.equal('/users');
    });

    it('dispatches an action to FETCH_CARE_TEAMS_RES with the normalized payload', function() {
      const ajaxStub = this.sandbox.stub(RxAjax, 'get').returns(Observable.of({ response: this.multiJsonApiResponse }));

      const result = getEpicResults(this.fetchUsersEpic)[0];
      expect(result.type).to.equal('NONE');
      expect(result.payload.entities).to.deep.equal({
        users: {
          [this.users[0].id]: merge({}, this.users[0], { type: 'users' }),
          [this.users[1].id]: merge({}, this.users[1], { type: 'users' }),
        },
      });
    });

    it('logs an error using Logging on error', function() {
      const errMessage = 'oops!';
      this.sandbox.stub(RxAjax, 'get').returns(Observable.throw(new Error(errMessage)));
      const loggingStub = this.sandbox.stub(Logging, 'error');

      getEpicResults(this.fetchUsersEpic);
      expect(loggingStub.args[0][0]).to.deep.equal(new Error(errMessage));
      expect(loggingStub.args[0][1]).to.equal('users#fetchEpic');
    });
  });

  describe('makeFindEpic creating find epic for user', function() {
    beforeEach(function() {
      this.findUserEpic = makeFindEpic('users');
    });

    it('sends a GET request to /users/:id using the id from the action', function() {
      const ajaxStub = this.sandbox.stub(RxAjax, 'get').returns(Observable.of({ response: this.jsonApiResponse }));

      getEpicResults(this.findUserEpic, { id: this.id });
      expect(ajaxStub.args[0][0]).to.equal(`/users/${this.id}`);
    });

    it('dispatches an action to FETCH_CARE_TEAMS_RES with the normalized payload', function() {
      const ajaxStub = this.sandbox.stub(RxAjax, 'get').returns(Observable.of({ response: this.jsonApiResponse }));

      const result = getEpicResults(this.findUserEpic, { id: this.id })[0];
      expect(result.type).to.equal('NONE');
      expect(result.payload.entities).to.deep.equal({
        users: {
          [this.id]: { id: this.id, type: 'users', name: this.name },
        },
      })
    });

    it('logs an error using Logging on error', function() {
      const errMessage = 'oops!';
      this.sandbox.stub(RxAjax, 'get').returns(Observable.throw(new Error(errMessage)));
      const loggingStub = this.sandbox.stub(Logging, 'error');

      getEpicResults(this.findUserEpic);
      expect(loggingStub.args[0][0]).to.deep.equal(new Error(errMessage));
      expect(loggingStub.args[0][1]).to.equal('users#findEpic');
    });

    it('dispatches an error flash message on error', function() {
      const errMessage = 'oops!';
      this.sandbox.stub(RxAjax, 'get').returns(Observable.throw(new Error(errMessage)));
      const loggingStub = this.sandbox.stub(Logging, 'error');

      const result = getEpicResults(this.findUserEpic)[0];
      expectFlashErrorAction(result);
    });
  });

  describe('makeCreateEpic creating create epic for user', function() {
    beforeEach(function() {
      this.createUserEpic = makeCreateEpic('users');
    });

    it('sends a POST request to /users with the passed in payload serialized', function() {
      const ajaxStub = this.sandbox.stub(RxAjax, 'post').returns(Observable.of({ response: this.jsonApiResponse }));
      const payload = { name: this.name };

      getEpicResults(this.createUserEpic, { payload });
      expect(ajaxStub.args[0][0]).to.equal('/users');
      expect(ajaxStub.args[0][1]).to.deep.equal({
        data: {
          type: 'users',
          attributes: payload,
        },
      });
    });

    it('dispatches an action to CREATE_CARE_TEAMS_RES with the mapped payload', function() {
      this.sandbox.stub(RxAjax, 'post').returns(Observable.of({ response: this.jsonApiResponse }));

      const result = getEpicResults(this.createUserEpic, { payload: {} })[0];
      expect(result.type).to.equal('NONE');
      expect(result.payload.entities).to.deep.equal({
        users: {
          [this.id]: { id: this.id, type: 'users', name: this.name },
        },
      });
    });

    it('logs an error using Logging on error', function() {
      const errMessage = 'oops!';
      this.sandbox.stub(RxAjax, 'post').returns(Observable.throw(new Error(errMessage)));
      const loggingStub = this.sandbox.stub(Logging, 'error');

      getEpicResults(this.createUserEpic, { payload: {} });
      expect(loggingStub.args[0][0]).to.deep.equal(new Error(errMessage));
      expect(loggingStub.args[0][1]).to.equal('users#createEpic');
    });

    it('deserializes the err response and passes it through using PUSH_ERRORS', function() {
      const detail = 'is required';
      const response = {
        errors: [{
          source: { pointer: '/data/attributes/owner-first-name' },
          detail,
        }],
      };
      const expectedErrObj = { ownerFirstName: detail };

      const errObject = { xhr: { responseText: JSON.stringify(response) } };
      this.sandbox.stub(RxAjax, 'post').returns(Observable.throw(errObject));
      this.sandbox.stub(Logging, 'error');

      const result = getEpicResults(this.createUserEpic, { payload: {} })[0];
      expect(result.type).to.equal(a.PUSH_ERRORS);
      expect(result.payload).to.deep.equal(expectedErrObj);
    });
  });
});