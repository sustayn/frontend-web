import { expect } from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs/Observable';

// This will import the class, as opposed to an instance of it
import { RxAjax } from 'services/RxAjax';

describe('RxAjax', function() {
    describe('on instantiation', function() {
        it('should set headers to empty if no config', function() {
            const rxAjax = new RxAjax({});

            expect(rxAjax.headers).to.deep.equal({});
        });

        it('should set headers as provided in config', function() {
            const headers = { 'Content-Type': 'application/json' };
            const rxAjax = new RxAjax({ headers });

            expect(rxAjax.headers).to.deep.equal(headers);
        });

        it('should set the baseUrl to empty string if not provided', function() {
            const rxAjax = new RxAjax({});

            expect(rxAjax.baseUrl).to.equal('');
        });

        it('should set the baseUrl if provided in config', function() {
            const baseUrl = 'http://example.com/something';
            const rxAjax = new RxAjax({ baseUrl });

            expect(rxAjax.baseUrl).to.equal(baseUrl);
        });

        it('should set afterRequest to pass through the response if no config', function() {
            const rxAjax = new RxAjax({});
            const test = 'test';

            expect(rxAjax.afterRequest(test)).to.equal(test);
        });

        it('should set afterRequest as provided in config', function() {
            const test = 'test';
            const rxAjax = new RxAjax({ afterRequest: (res) => test });

            expect(rxAjax.afterRequest('test2')).to.equal(test);
        });
    });

    describe('after instantiation', function() {
        beforeEach(function() {
            this.defaultHeaders = { 'Content-Type': 'application/json' };
            const afterRequest = (res) => { return res; };
            this.rxAjax = new RxAjax({ headers: this.defaultHeaders, afterRequest });
        });

        describe('ajax', function() {
            beforeEach(function() {
                this.ajaxStub = sinon.stub(Observable, 'ajax');
                this.ajaxStub.returns({ map: function() {} });
                this.url = '/hello/world';
                this.body = { name: 'Jake' };
                this.headers = { uid: 'jake@example.com' };
            });
            afterEach(function() {
                this.ajaxStub.restore();
            });

            it('can take a string url as the argument and sets it to the url prop of the req', function() {
                this.rxAjax.ajax(this.url);

                expect(this.ajaxStub.args[0][0].url).to.equal(this.url);
            });

            it('can take an arbitrary object as the argument', function() {
                const something = 'random';
                this.rxAjax.ajax({ url: this.url, something });

                expect(this.ajaxStub.args[0][0].url).to.equal(this.url);
                expect(this.ajaxStub.args[0][0].something).to.equal(something);
            });

            it('uses the set headers for the request', function() {
                this.rxAjax.ajax(this.url);

                expect(this.ajaxStub.args[0][0]).to.deep.equal({ url: this.url, headers: this.defaultHeaders });
            });

            it('prepends the baseUrl to the request', function() {
                const baseUrl = 'http://example.com/something';
                const rxAjax = new RxAjax({ baseUrl });
                rxAjax.ajax(this.url);

                expect(this.ajaxStub.args[0][0].url).to.equal(`${baseUrl}${this.url}`);
            });

            it('will assign headers passed in to the request argument', function() {
                const newHeaders = { 'Content-Type': 'application/vnd.api+json', uid: 'jake@example.com' };
                this.rxAjax.ajax({ url: this.url, headers: newHeaders });

                expect(this.ajaxStub.args[0][0]).to.deep.equal({ url: this.url, headers: newHeaders });
            });

            it('will map the response to afterRequest', function() {
                const mapSpy = sinon.spy();
                this.ajaxStub.returns({ map: mapSpy });
                this.rxAjax.ajax(this.url);

                expect(mapSpy.calledOnce).to.be.true;
                expect(mapSpy.args[0][0]).to.be.function;
                expect(mapSpy.args[0][1] instanceof RxAjax).to.be.true;
            });
        });

        describe('convenience methods', function() {
            beforeEach(function() {
                this.ajaxSpy = sinon.spy();
                this.rxAjax.ajax = this.ajaxSpy;
                this.url = '/hello/world';
                this.body = { name: 'Jake' };
                this.headers = { uid: 'jake@example.com' };
            });

            it('get calls ajax with url, headers, and method GET', function() {
                this.rxAjax.get(this.url, this.headers);
                const expectedArgs = { method: 'GET', url: this.url, headers: this.headers };

                expect(this.ajaxSpy.args[0][0]).to.deep.equal(expectedArgs);
            });

            it('post calls ajax with url, body, headers, and method POST', function() {
                this.rxAjax.post(this.url, this.body, this.headers);
                const expectedArgs = { method: 'POST', url: this.url, body: this.body, headers: this.headers };

                expect(this.ajaxSpy.args[0][0]).to.deep.equal(expectedArgs);
            });

            it('delete calls ajax with url, body, headers, and method DELETE', function() {
                this.rxAjax.delete(this.url, this.body, this.headers);
                const expectedArgs = { method: 'DELETE', url: this.url, body: this.body, headers: this.headers };

                expect(this.ajaxSpy.args[0][0]).to.deep.equal(expectedArgs);
            });

            it('patch calls ajax with url, body, headers, and method PATCH', function() {
                this.rxAjax.patch(this.url, this.body, this.headers);
                const expectedArgs = { method: 'PATCH', url: this.url, body: this.body, headers: this.headers };

                expect(this.ajaxSpy.args[0][0]).to.deep.equal(expectedArgs);
            });

            it('put calls ajax with url, body, headers, and method PUT', function() {
                this.rxAjax.put(this.url, this.body, this.headers);
                const expectedArgs = { method: 'PUT', url: this.url, body: this.body, headers: this.headers };

                expect(this.ajaxSpy.args[0][0]).to.deep.equal(expectedArgs);
            });
        });

        describe('set/reset headers', function() {
            it('sets headers by assigning the object', function() {
                const uid = 'jake@example.com';
                const contentType = this.rxAjax.headers['Content-Type'];
                this.rxAjax.setHeaders({ uid });

                expect(this.rxAjax.headers).to.deep.equal({ uid, 'Content-Type': contentType });
            });

            it('setting headers will override old keys', function() {
                const newHeaders = { 'Content-Type': 'application/json', uid: 'jake@example.com' };
                this.rxAjax.setHeaders(newHeaders);

                expect(this.rxAjax.headers).to.deep.equal(newHeaders);
            });

            it('will reset headers to the default', function() {
                const originalContentType = this.rxAjax.headers['Content-Type'];
                const newContentType = 'application/vnd.api+json';

                this.rxAjax.setHeaders({ 'Content-Type': newContentType });
                expect(this.rxAjax.headers).to.deep.equal({ 'Content-Type': newContentType });

                this.rxAjax.resetHeaders();
                expect(this.rxAjax.headers).to.deep.equal({ 'Content-Type': originalContentType });
            });
        });
    });
});