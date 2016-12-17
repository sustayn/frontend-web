import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ActivateUser } from 'services/authentication/Components/ActivateUser';

describe('Service | Authentication | Component | ActivateUser', () => {
    describe('the input fields', function() {
        beforeEach(function() {
            this.wrapper = shallow(<ActivateUser />);
        });

        it('has an input field with type password', function() {
            const input = this.wrapper.find('.spec-password-field');

            expect(input).to.have.length(1);
            expect(input.props().type).to.equal('password');
        });

        it('sets the password state on password input change', function() {
            const value = 'test';
            this.wrapper.find('.spec-password-field').simulate('change', { target: { value } });

            expect(this.wrapper.state('password')).to.equal(value);
        });

        it('has an input field with type password for confirmation', function() {
            const input = this.wrapper.find('.spec-confirmation-field');

            expect(input).to.have.length(1);
            expect(input.props().type).to.equal('password');
        });

        it('sets the password_confirmation state on password_confirmation input change', function() {
            const value = 'test';
            this.wrapper.find('.spec-confirmation-field').simulate('change', { target: { value } });

            expect(this.wrapper.state('password_confirmation')).to.equal(value);
        });

        it('has an input field for name', function() {
            const input = this.wrapper.find('.spec-name-field');

            expect(input).to.have.length(1);
            expect(input.props().type).to.equal('text');
        });

        it('sets the name state on name input change', function() {
            const value = 'test';
            this.wrapper.find('.spec-name-field').simulate('change', { target: { value } });

            expect(this.wrapper.state('name')).to.equal(value);
        });

        it('has an input field for nickname', function() {
            const input = this.wrapper.find('.spec-nickname-field');

            expect(input).to.have.length(1);
            expect(input.props().type).to.equal('text');
        });

        it('sets the nickname state on nickname input change', function() {
            const value = 'test';
            this.wrapper.find('.spec-nickname-field').simulate('change', { target: { value } });

            expect(this.wrapper.state('nickname')).to.equal(value);
        });
    });

    describe('submitting the form', function() {
        beforeEach(function() {
            this.activateReqSpy = sinon.spy();
            this.wrapper = shallow(<ActivateUser activateReq={this.activateReqSpy} />);
            this.password = 'password';
            this.password_confirmation = 'password';

            this.wrapper.find('.spec-password-field').simulate('change', { target: { value: this.password }});
            this.wrapper.find('.spec-confirmation-field').simulate('change', { target: { value: this.password_confirmation }});
        });

        it('calls activateReq with the sign up attributes if no errors', function() {
            const name = 'Jake';
            const nickname = 'Jkerz';

            this.wrapper.find('.spec-name-field').simulate('change', { target: { value: name }});
            this.wrapper.find('.spec-nickname-field').simulate('change', { target: { value: nickname }});

            this.wrapper.find('.spec-submit-button').simulate('click');
            expect(this.activateReqSpy.args[0][0]).to.deep.equal({
                password: this.password,
                password_confirmation: this.password_confirmation,
                name,
                nickname,
            });
        });

        it('allows for not specifying name or nickname', function() {
            this.wrapper.find('.spec-submit-button').simulate('click');
            expect(this.activateReqSpy.args[0][0]).to.deep.equal({
                password: this.password,
                password_confirmation: this.password_confirmation
            });
        });

        it('renders password errors and does not submit if there are errors', function() {
            this.wrapper.find('.spec-confirmation-field').simulate('change', { target: { value: 'not the password' }});
            this.wrapper.find('.spec-submit-button').simulate('click');
            const passwordErrors = this.wrapper.state('passwordErrors');

            expect(passwordErrors).to.not.be.null;
            expect(this.wrapper.find('.spec-password-errors').text()).to.equal(passwordErrors);
            expect(this.activateReqSpy.notCalled).to.be.true;
        });

        it('can submit with onEnter', function() {
            this.wrapper.find('.spec-confirmation-field').simulate('keypress', { key: 'Enter' });

            expect(this.activateReqSpy.calledOnce).to.be.true;
        });
    });
});