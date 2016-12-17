import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import Router from 'react-router/lib/Router';

import { App } from 'containers/App';
import Root from 'containers/Root';
import routes from 'app/routes';

describe('Containers |', function() {
    describe('App |', function() {
        it('should render self', function() {
            const wrapper = shallow(<App />);
            expect(wrapper.find('.app')).to.have.length(1);
        });

        it('should render children', function() {
            const wrapper = shallow(
                <App>
                    <div className='child' />
                </App>
            );

            expect(wrapper.contains(<div className='child' />)).to.equal(true);
        });
    });

    describe('Root |', function() {
        it('should render self', function() {
            const wrapper = shallow(<Root routes={routes} />);
            expect(wrapper.find('.spec-provider')).to.have.length(1);
        });

        it('should render router', function() {
            const wrapper = shallow(<Root routes={routes} />);

            expect(wrapper.containsMatchingElement(<Router />)).to.equal(true);
        });
    });
});
