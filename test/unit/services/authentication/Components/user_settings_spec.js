import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { UserSettings } from 'services/authentication/Components/UserSettings';

describe('Service | Authentication | Component | UserSettings', () => {
    it('populates the fields with currentUser information', function() {
        const name = 'Jake';
        const nickname = 'Jkerz';
        const currentUser = { name, nickname };
        const wrapper = shallow(<UserSettings currentUser={currentUser} />);

        expect(wrapper.find('input.spec-name-field').props().value).to.equal(name);
        expect(wrapper.find('input.spec-nickname-field').props().value).to.equal(nickname);
    });

    describe('the input fields', function() {
        beforeEach(function() {
            this.wrapper = shallow(<UserSettings />);
        });

        it('has an input field for name', function() {
            const input = this.wrapper.find('input.spec-name-field');

            expect(input).to.have.length(1);
            expect(input.props().type).to.equal('text');
        });

        it('sets the name state on name input change', function() {
            const value = 'test';
            this.wrapper.find('input.spec-name-field').simulate('change', { target: { value } });

            expect(this.wrapper.state('name')).to.equal(value);
        });

        it('has an input field for nickname', function() {
            const input = this.wrapper.find('input.spec-nickname-field');

            expect(input).to.have.length(1);
            expect(input.props().type).to.equal('text');
        });

        it('sets the nickname state on nickname input change', function() {
            const value = 'test';
            this.wrapper.find('input.spec-nickname-field').simulate('change', { target: { value } });

            expect(this.wrapper.state('nickname')).to.equal(value);
        });
    });

    describe('submitting the form', function() {
        beforeEach(function() {
            this.updateUserReqSpy = sinon.spy();
            this.wrapper = shallow(<UserSettings updateUserReq={this.updateUserReqSpy} />);
            this.name = 'Jake';
            this.nickname = 'Jkerz';

            this.wrapper.find('input.spec-name-field').simulate('change', { target: { value: this.name }});
            this.wrapper.find('input.spec-nickname-field').simulate('change', { target: { value: this.nickname }});
        });

        it('calls updateUserReq with the sign up attributes if no errors', function() {
            this.wrapper.find('.spec-submit-button').simulate('click');
            expect(this.updateUserReqSpy.args[0][0]).to.deep.equal({
                name: this.name,
                nickname: this.nickname,
            });
        });

        it('can submit with onEnter', function() {
            this.wrapper.find('input.spec-nickname-field').simulate('keypress', { key: 'Enter' });
            expect(this.updateUserReqSpy.calledOnce).to.be.true;
        });
    });
});