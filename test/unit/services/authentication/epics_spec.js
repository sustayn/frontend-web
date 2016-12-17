import { expect } from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import jsdom from 'jsdom';

import getEpicResults from 'test/helpers/getEpicResults';
import {
    onLoadEpic,
    validateTokenEpic,
    signinEpic,
    registerEpic,
    activateEpic,
    signoutEpic,
    updateUserEpic,
    updatePasswordEpic,
    resetPasswordEpic,
    forgotPasswordEpic,
    onLoadFunctions,
} from 'services/authentication/epics';
import { a } from 'services/authentication/actions';
import RxAjax from 'services/RxAjax';
import { AuthConfig } from 'app/config';

describe('Service | Authentication | Epics', function() {
    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
    });
    afterEach(function() {
        this.sandbox.restore();
    });

    describe('onLoadEpic', function() {
        it('returns an object for VALIDATE_TOKEN if there are stored auth values', function() {
            const expiry = parseInt((new Date().getTime() + (60 * 60 * 4))/1000);
            const accessToken = '123abc';
            const client = '456def';
            const uid = 'jake@example.com';
            const getItemStub = this.sandbox.stub(AuthConfig.storage, 'getItem').withArgs('expiry').returns(expiry);
            getItemStub.withArgs('access-token').returns(accessToken);
            getItemStub.withArgs('client').returns(client);
            getItemStub.withArgs('uid').returns(uid);

            const result = getEpicResults(onLoadEpic)[0];
            expect(result).to.deep.equal({
                type:    a.VALIDATE_TOKEN,
                headers: { 'access-token': accessToken, client, uid },
            });
        });

        it('returns SIGN_OUT_USER if there are not stored auth values', function() {
            const expiry = parseInt((new Date().getTime() + (60 * 60 * 4))/1000);
            const getItemStub = this.sandbox.stub(AuthConfig.storage, 'getItem').withArgs('expiry').returns(expiry);
            getItemStub.withArgs('access-token').returns(null);

            const result = getEpicResults(onLoadEpic)[0];
            expect(result).to.deep.equal({ type: a.SIGN_OUT_USER });
        });

        it('returns an object for SIGN_OUT_USER action if expiry is too old', function() {
            const expiry = parseInt((new Date().getTime() - (60 * 60 * 4))/1000);
            this.sandbox.stub(AuthConfig.storage, 'getItem').returns(expiry);

            const result = getEpicResults(onLoadEpic)[0];
            expect(result).to.deep.equal({ type: a.SIGN_OUT_USER });
        });
    });

    describe('validateTokenEpic', function() {
        it('sends a GET request to /auth/validate_token with headers', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'get').returns(Observable.of({
                response: { data: {} }
            }));
            const headers = { uid: 'jake@example.com' };

            getEpicResults(validateTokenEpic, { headers })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth/validate_token');
            expect(ajaxStub.args[0][1]).to.deep.equal(headers);
        });

        it('dispatches USER_AUTHENTICATED with currentUser on success', function() {
            const currentUser = { name: 'Jake' };
            this.sandbox.stub(RxAjax, 'get').returns(Observable.of({
                response: { data: currentUser }
            }));

            const result = getEpicResults(validateTokenEpic)[0];
            expect(result).to.deep.equal({ type: a.USER_AUTHENTICATED, currentUser });
        });

        it('dispatches VALIDATE_TOKEN_SUCCESS on success', function() {
            this.sandbox.stub(RxAjax, 'get').returns(Observable.of({
                response: { data: {} }
            }));

            const result = getEpicResults(validateTokenEpic)[1];
            expect(result.type).to.equal(a.VALIDATE_TOKEN_SUCCESS);
        });

        it('dispatches sign out action on error', function() {
            this.sandbox.stub(RxAjax, 'get').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(validateTokenEpic)[0];
            expect(result).to.deep.equal({ type: a.SIGN_OUT_USER });
        });

        it('dispatches VALIDATE_TOKEN_FAILURE on error', function() {
            this.sandbox.stub(RxAjax, 'get').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(validateTokenEpic)[1];
            expect(result.type).to.equal(a.VALIDATE_TOKEN_FAILURE);
            expect(result.err).to.not.be.null;
        });
    });

    describe('signinEpic', function() {
        it('POSTS to /auth/sign_in with provided body', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'post').returns(Observable.of({
                response: { data: {} }
            }));
            const body = { email: 'jake@example.com' };

            getEpicResults(signinEpic, { body })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth/sign_in');
            expect(ajaxStub.args[0][1]).to.deep.equal(body);
        });

        it('dispatches USER_AUTHENTICATED with currentUser on success', function() {
            const currentUser = { name: 'Jake' };
            this.sandbox.stub(RxAjax, 'post').returns(Observable.of({
                response: { data: currentUser }
            }));

            const result = getEpicResults(signinEpic)[0];
            expect(result).to.deep.equal({ type: a.USER_AUTHENTICATED, currentUser });
        });

        it('dispatches a SIGN_IN_SUCCESS action on success', function() {
            this.sandbox.stub(RxAjax, 'post').returns(Observable.of({
                response: { data: {} }
            }));

            const result = getEpicResults(signinEpic)[1];
            expect(result.type).to.equal(a.SIGN_IN_SUCCESS);
            expect(result.message).to.not.be.null;
        });

        it('dispatches a SIGN_IN_FAILURE action on error', function() {
            this.sandbox.stub(RxAjax, 'post').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(signinEpic)[0];
            expect(result.type).to.equal(a.SIGN_IN_FAILURE);
            expect(result.message).to.not.be.null;
        });
    });

    describe('registerEpic', function() {
        it('POSTS to /auth with a serialized body', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'post').returns(Observable.of({}));
            const firstName = 'Jake';
            const email = 'jake@example.com';
            const body = { firstName, email };

            getEpicResults(registerEpic, { body })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth');
            expect(ajaxStub.args[0][1]).to.deep.equal({
                data: {
                    type: 'user-registrations',
                    attributes: { 'first-name': firstName, email }
                }
            });
        });

        it('dispatches a REGISTER_SUCCESS action on success', function() {
            this.sandbox.stub(RxAjax, 'post').returns(Observable.of({}));

            const result = getEpicResults(registerEpic, { body: {} })[0];
            expect(result.type).to.equal(a.REGISTER_SUCCESS);
            expect(result.message).to.not.be.null;
        });

        it('dispatches a REGISTER_FAILURE action on failure', function() {
            this.sandbox.stub(RxAjax, 'post').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(registerEpic, { body: {} })[0];
            expect(result.type).to.equal(a.REGISTER_FAILURE);
            expect(result.message).to.not.be.null;
        });
    });

    describe('activateEpic', function() {
        it('dispatches an ACTIVATE_FAILURE if it cant find the confirmation token', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'post');

            const result = getEpicResults(activateEpic)[0];
            expect(ajaxStub.calledOnce).to.be.false;
            expect(result.type).to.equal(a.ACTIVATE_FAILURE);
            expect(result.message).to.not.be.null;
        });

        it('dispatches an ACTIVATE_FAILURE if it isnt on the activate Route', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'post');
            jsdom.changeURL(window, `http://example.com?confirmation_token=${this.confirmationToken}`);

            const result = getEpicResults(activateEpic)[0];
            expect(ajaxStub.calledOnce).to.be.false;
            expect(result.type).to.equal(a.ACTIVATE_FAILURE);
            expect(result.message).to.not.be.null;

            jsdom.changeURL(window, 'http://example.com');
        });

        describe('with the confirmation token', function() {
            beforeEach(function() {
                this.confirmationToken = '123abc';
                jsdom.changeURL(window, `http://example.com${AuthConfig.activateRoute}?confirmation_token=${this.confirmationToken}`);
            });
            afterEach(function() {
                jsdom.changeURL(window, 'http://example.com');
            });

            it('POSTS to /auth/activate with provided body and confirmation token', function() {
                const ajaxStub = this.sandbox.stub(RxAjax, 'post').returns(Observable.of({
                    response: { data: {} }
                }));
                const name = 'jake';

                getEpicResults(activateEpic, { body: { name } });
                expect(ajaxStub.args[0][0]).to.equal('/auth/activate');
                expect(ajaxStub.args[0][1]).to.deep.equal({ name, confirmation_token: this.confirmationToken })
            });

            it('dispatches USER_AUTHENTICATED with currentUser on success', function() {
                const currentUser = { name: 'Jake' };
                this.sandbox.stub(RxAjax, 'post').returns(Observable.of({
                    response: { data: currentUser }
                }));

                const result = getEpicResults(activateEpic, { body: {} })[0];
                expect(result).to.deep.equal({ type: a.USER_AUTHENTICATED, currentUser });
            });

            it('dispatches ACTIVATE_SUCCESS on success', function() {
                this.sandbox.stub(RxAjax, 'post').returns(Observable.of({
                    response: { data: {} }
                }));

                const result = getEpicResults(activateEpic, { body: {} })[1];
                expect(result.type).to.equal(a.ACTIVATE_SUCCESS);
                expect(result.message).to.not.be.null;
            });

            it('dispatches ACTIVATE_FAILURE on error', function() {
                const ajaxStub = this.sandbox.stub(RxAjax, 'post').returns(Observable.throw(new Error('oops!')));

                const result = getEpicResults(activateEpic, { body: {} })[0];
                expect(result.type).to.equal(a.ACTIVATE_FAILURE);
                expect(result.message).to.not.be.null;
            });
        });
    });

    describe('signoutEpic', function() {
        it('DELETES to /auth/sign_out', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'delete').returns(Observable.of({}));

            getEpicResults(signoutEpic)[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth/sign_out');
        });

        it('dispatches SIGN_OUT_USER on success', function() {
            this.sandbox.stub(RxAjax, 'delete').returns(Observable.of({}));

            const result = getEpicResults(signoutEpic)[0];
            expect(result).to.deep.equal({ type: a.SIGN_OUT_USER });
        });

        it('dispatches SIGN_OUT_SUCCESS on success', function() {
            this.sandbox.stub(RxAjax, 'delete').returns(Observable.of({}));
            const result = getEpicResults(signoutEpic)[1];
            expect(result.type).to.equal(a.SIGN_OUT_SUCCESS);
        });

        it('dispatches SIGN_OUT_FAILURE on error', function() {
            this.sandbox.stub(RxAjax, 'delete').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(signoutEpic)[0];
            expect(result.type).to.equal(a.SIGN_OUT_FAILURE);
        });
    });

    describe('updateUserEpic', function() {
        it('PUTS to /auth with provided attrs', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: {} }
            }));
            const attrs = { email: 'jake@example.com' };

            getEpicResults(updateUserEpic, { attrs })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth');
            expect(ajaxStub.args[0][1]).to.deep.equal(attrs);
        });

        it('dispatches USER_AUTHENTICATED with currentUser on success', function() {
            const currentUser = { name: 'Jake' };
            this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: currentUser }
            }));

            const result = getEpicResults(updateUserEpic)[0];
            expect(result).to.deep.equal({ type: a.USER_AUTHENTICATED, currentUser });
        });

        it('dispatches UPDATE_USER_SUCCESS on success', function() {
            this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: {} }
            }));

            const result = getEpicResults(updateUserEpic)[1];
            expect(result.type).to.equal(a.UPDATE_USER_SUCCESS);
            expect(result.message).to.not.be.null;
        });

        it('dispatches UPDATE_USER_FAILURE on error', function() {
            this.sandbox.stub(RxAjax, 'put').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(updateUserEpic)[0];
            expect(result.type).to.equal(a.UPDATE_USER_FAILURE);
            expect(result.message).to.not.be.null;
        });
    });

    describe('updatePasswordEpic', function() {
        it('PUTS to /auth/password with provided attrs', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: {} }
            }));
            const attrs = { password: 'password' };

            getEpicResults(updatePasswordEpic, { attrs })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth/password');
            expect(ajaxStub.args[0][1]).to.deep.equal(attrs);
        });

        it('dispatches USER_AUTHENTICATED with currentUser on success', function() {
            const currentUser = { name: 'Jake' };
            this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { user: currentUser }
            }));

            const result = getEpicResults(updatePasswordEpic)[0];
            expect(result).to.deep.equal({ type: a.USER_AUTHENTICATED, currentUser });
        });

        it('dispatches UPDATE_PASSWORD_SUCCESS on success', function() {
            this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: {} }
            }));

            const result = getEpicResults(updatePasswordEpic)[1];
            expect(result.type).to.equal(a.UPDATE_PASSWORD_SUCCESS);
            expect(result.message).to.not.be.null;
        });

        it('dispatches UPDATE_PASSWORD_FAILURE on error', function() {
            this.sandbox.stub(RxAjax, 'put').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(updatePasswordEpic)[0];
            expect(result.type).to.equal(a.UPDATE_PASSWORD_FAILURE);
            expect(result.message).to.not.be.null;
        });
    });

    describe('resetPasswordEpic', function() {
        it('POSTS to /auth/password with provided attrs', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'put').returns(Observable.of({}));
            const attrs = {
                password: 'password',
                password_confirmation: 'password',
                reset_password_token: 'reset_password_token',
            };

            getEpicResults(resetPasswordEpic, { attrs })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth/password');
            expect(ajaxStub.args[0][1]).to.deep.equal(attrs);
        });

        it('dispatches USER_AUTHENTICATED with currentUser on success', function() {
            const currentUser = { name: 'Jake' };
            this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: currentUser }
            }));

            const result = getEpicResults(resetPasswordEpic)[0];
            expect(result).to.deep.equal({ type: a.USER_AUTHENTICATED, currentUser });
        });

        it('dispatches RESET_PASSWORD_SUCCESS on success', function() {
            this.sandbox.stub(RxAjax, 'put').returns(Observable.of({
                response: { data: {} }
            }));

            const result = getEpicResults(resetPasswordEpic)[1];
            expect(result.type).to.equal(a.RESET_PASSWORD_SUCCESS);
            expect(result.message).to.not.be.empty;
        });

        it('dispatches RESET_PASSWORD_FAILURE on error', function() {
            this.sandbox.stub(RxAjax, 'put').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(resetPasswordEpic)[0];
            expect(result.type).to.equal(a.RESET_PASSWORD_FAILURE);
            expect(result.message).to.not.be.empty;
        });
    });

    describe('forgotPasswordEpic', function() {
        it('POSTS to /auth/password with provided body(email)', function() {
            const ajaxStub = this.sandbox.stub(RxAjax, 'post').returns(Observable.of({}));
            const email = 'jake@example.com';

            getEpicResults(forgotPasswordEpic, { email })[0];
            expect(ajaxStub.args[0][0]).to.equal('/auth/password');
            expect(ajaxStub.args[0][1]).to.deep.equal({ email });
        });

        it('dispatches FORGOT_PASSWORD_SUCCESS on success', function() {
            this.sandbox.stub(RxAjax, 'post').returns(Observable.of({}));

            const result = getEpicResults(forgotPasswordEpic)[0];
            expect(result.type).to.equal(a.FORGOT_PASSWORD_SUCCESS);
            expect(result.message).to.not.be.empty;
        });

        it('dispatches FORGOT_PASSWORD_FAILURE on error', function() {
            this.sandbox.stub(RxAjax, 'post').returns(Observable.throw(new Error('oops!')));

            const result = getEpicResults(forgotPasswordEpic)[0];
            expect(result.type).to.equal(a.FORGOT_PASSWORD_FAILURE);
            expect(result.message).to.not.be.empty;
        });
    });
});