import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ResetPassword } from 'services/authentication/Components/ResetPassword';
import { AuthConfig } from 'app/config';

describe('Service | Authentication | Component | ResetPassword', () => {
  describe('the input fields', function() {
    beforeEach(function() {
      this.wrapper = shallow(<ResetPassword />);
    });

    it('has an input field with type password', function() {
      const input = this.wrapper.find('input.spec-password-field');

      expect(input).to.have.length(1);
      expect(input.props().type).to.equal('password');
    });

    it('sets the password state on password input change', function() {
      const value = 'test';
      this.wrapper.find('input.spec-password-field').simulate('change', { target: { value } });

      expect(this.wrapper.state('password')).to.equal(value);
    });

    it('has an input field with type password for confirmation', function() {
      const input = this.wrapper.find('input.spec-confirmation-field');

      expect(input).to.have.length(1);
      expect(input.props().type).to.equal('password');
    });

    it('sets the password_confirmation state on password_confirmation input change', function() {
      const value = 'test';
      this.wrapper.find('input.spec-confirmation-field').simulate('change', { target: { value } });

      expect(this.wrapper.state('password_confirmation')).to.equal(value);
    });
  });

  describe('submitting the form', function() {
    beforeEach(function() {
      this.resetPasswordToken = '123abc';
      this.resetPasswordReqSpy = sinon.spy();
      this.wrapper = shallow(<ResetPassword 
        resetPasswordReq={this.resetPasswordReqSpy}
        pathname={AuthConfig.resetRoute}
        resetPasswordToken={this.resetPasswordToken}
      />);
      this.password = 'password';
      this.password_confirmation = 'password';

      this.wrapper.find('input.spec-password-field').simulate('change', { target: { value: this.password }});
      this.wrapper.find('input.spec-confirmation-field').simulate('change', { target: { value: this.password_confirmation }});
    });

    it('calls resetPasswordReq with the sign up attributes if no errors', function() {
      this.wrapper.find('.spec-submit-button').simulate('click');
      expect(this.resetPasswordReqSpy.args[0][0]).to.deep.equal({
        password: this.password,
        password_confirmation: this.password_confirmation,
        reset_password_token: this.resetPasswordToken,
      });
    });

    it('renders password errors and does not submit if there are errors', function() {
      this.wrapper.find('input.spec-confirmation-field').simulate('change', { target: { value: 'not the password' }});
      this.wrapper.find('.spec-submit-button').simulate('click');
      const passwordErrors = this.wrapper.state('passwordErrors');

      expect(passwordErrors).to.not.be.null;
      expect(this.wrapper.find('.spec-password-errors').text()).to.equal(passwordErrors);
      expect(this.resetPasswordReqSpy.notCalled).to.be.true;
    });

    it('renders errors if not at the reset route', function() {
      const wrapper = shallow(<ResetPassword 
        resetPasswordReq={this.resetPasswordReqSpy}
        pathname='/not_reset_route'
        resetPasswordToken={this.resetPasswordToken}
      />);
      wrapper.find('input.spec-password-field').simulate('change', { target: { value: this.password }});
      wrapper.find('input.spec-confirmation-field').simulate('change', { target: { value: this.password_confirmation }});

      wrapper.find('.spec-submit-button').simulate('click');
      const passwordErrors = wrapper.state('passwordErrors');

      expect(passwordErrors).to.not.be.null;
      expect(wrapper.find('.spec-password-errors').text()).to.equal(passwordErrors);
      expect(this.resetPasswordReqSpy.notCalled).to.be.true;
    });

    it('renders errors if it cant find the reset_password_token', function() {
      const wrapper = shallow(<ResetPassword 
        resetPasswordReq={this.resetPasswordReqSpy}
        pathname={AuthConfig.resetRoute}
        resetPasswordToken={undefined}
      />);
      wrapper.find('input.spec-password-field').simulate('change', { target: { value: this.password }});
      wrapper.find('input.spec-confirmation-field').simulate('change', { target: { value: this.password_confirmation }});

      wrapper.find('.spec-submit-button').simulate('click');
      const passwordErrors = wrapper.state('passwordErrors');

      expect(passwordErrors).to.not.be.null;
      expect(wrapper.find('.spec-password-errors').text()).to.equal(passwordErrors);
      expect(this.resetPasswordReqSpy.notCalled).to.be.true;
    });

    it('can submit onEnter', function() {
      this.wrapper.find('input.spec-confirmation-field').simulate('keypress', { key: 'Enter' });
      expect(this.resetPasswordReqSpy.calledOnce).to.be.true;
    });
  });
});