import { expect } from 'chai';
import sinon from 'sinon';
import Keen from 'keen-tracking';

import { Logging } from 'services/Logging';
import { Env } from 'app/config';

describe('Services | Logging', function() {
    describe('on instantiation', function() {
        it('should set logAnalytics to logAnalyticsDev if Env is not prod', function() {
            const origEnv = Env.isProduction;
            Env.isProduction = false;

            const logging = new Logging({ logAnalyticsDev: true });
            expect(logging.logAnalytics).to.be.true;

            Env.isProduction = origEnv;
        });

        it('should instantiate keenError and keenAnalytics clients if in prod', function() {
            const origEnv = Env.isProduction;
            Env.isProduction = true;

            const keenErrorConfig = { projectId: 'SOMETHING', writeKey: 'SOMETHING' };
            const keenAnalyticsConfig = { projectId: 'SOMETHING', writeKey: 'SOMETHING' };

            const logging = new Logging({ keenErrorConfig, keenAnalyticsConfig });
            expect(logging.keenErrorClient instanceof Keen).to.be.true;
            expect(logging.keenAnalyticsClient instanceof Keen).to.be.true;

            Env.isProduction = origEnv;
        });

        it('should call _setupKeenDefaults if in prod', function() {
            const origEnv = Env.isProduction;
            Env.isProduction = true;
            const sandbox = sinon.sandbox.create();

            const keenErrorConfig = { projectId: 'SOMETHING', writeKey: 'SOMETHING' };
            const keenAnalyticsConfig = { projectId: 'SOMETHING', writeKey: 'SOMETHING' };

            const setupStub = sandbox.stub(Logging.prototype, '_setupKeenDefaults');
            const logging = new Logging({ keenErrorConfig, keenAnalyticsConfig });
            expect(setupStub.calledOnce).to.be.true;

            sandbox.restore();
            Env.isProduction = origEnv;
        });
    });

    describe('after instantiation in dev', function() {
        beforeEach(function() {
            this.origEnv = Env.isProduction;
            Env.isProduction = false;

            this.logging = new Logging({});
            this.sandbox = sinon.sandbox.create();
        });
        afterEach(function() {
            this.sandbox.restore();
            Env.isProduction = this.origEnv;
        });

        it('should log errors in the console', function() {
            const message = 'test';
            const errStub = this.sandbox.stub(console, 'error');

            this.logging.error(message, 'location');
            expect(errStub.calledWithExactly(message)).to.be.true;
        });
    });

    describe('after instantiation in prod', function() {
        beforeEach(function() {
            this.origEnv = Env.isProduction;
            Env.isProduction = true;

            const keenErrorConfig = { projectId: 'SOMETHING', writeKey: 'SOMETHING' };
            const keenAnalyticsConfig = { projectId: 'SOMETHING', writeKey: 'SOMETHING' };
            this.logging = new Logging({ keenErrorConfig, keenAnalyticsConfig });
            this.sandbox = sinon.sandbox.create();
        });
        afterEach(function() {
            this.sandbox.restore();
            Env.isProduction = this.origEnv;
        });

        it('should record an event for keenErrorClient', function() {
            const message = 'test';
            const location = 'here';
            const eventStub = this.sandbox.stub(this.logging.keenErrorClient, 'recordEvent');

            this.logging.error(message, location);
            expect(eventStub.args[0][0]).to.equal('error');
            expect(eventStub.args[0][1]).to.deep.equal({ message, location });
        });

        it('should record an event for keenAnalyticsClient', function() {
            const event = 'test';
            const data = { my: 'data' };
            const eventStub = this.sandbox.stub(this.logging.keenAnalyticsClient, 'recordEvent');

            this.logging.analytics(event, data);
            expect(eventStub.args[0][0]).to.equal(event);
            expect(eventStub.args[0][1]).to.deep.equal(data);
        });

        it('should correctly set up the keen extendEvents for both errors and analytics', function() {
            const errorSpy = this.sandbox.spy(this.logging.keenErrorClient, 'extendEvents');
            const analyticsSpy = this.sandbox.spy(this.logging.keenAnalyticsClient, 'extendEvents');
            Keen.helpers.getBrowserProfile = () => { return 'browser'; };
            Keen.helpers.getWindowProfile = () => { return 'window'; };

            this.logging._setupKeenDefaults();
            [errorSpy, analyticsSpy].forEach((spy) => {
                const returned = spy.args[0][0]();
                expect(returned.page.url).to.be.not.null;
                expect(returned.tech.browser).to.equal('browser');
                expect(returned.tech.window).to.equal('window');
                expect(returned.tech.ua).to.equal('${keen.user_agent}');
                expect(returned.time).to.be.not.null;
                expect(typeof returned.keen).to.equal('object');
            });
        });
    });
});