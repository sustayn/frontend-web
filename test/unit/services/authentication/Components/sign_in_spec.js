import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { SignIn } from 'services/authentication/Components/SignIn';

describe('Service | Authentication | Component | SignIn', () => {
  it('has an input field with type email', function() {
    const wrapper = shallow(<SignIn />);
    const input = wrapper.find('input.spec-email-field');

    expect(input).to.have.length(1);
    expect(input.props().type).to.equal('email');
  });

  it('has an input field with type password', function() {
    const wrapper = shallow(<SignIn />);
    const input = wrapper.find('input.spec-password-field');

    expect(input).to.have.length(1);
    expect(input.props().type).to.equal('password');
  });

  it('sets the email state on email input change', function() {
    const wrapper = shallow(<SignIn />);
    const value = 'test';
    wrapper.find('input.spec-email-field').simulate('change', { target: { value } });

    expect(wrapper.state('email')).to.equal(value);
  });

  it('sets the password state on password input change', function() {
    const wrapper = shallow(<SignIn />);
    const value = 'test';
    wrapper.find('input.spec-password-field').simulate('change', { target: { value } });

    expect(wrapper.state('password')).to.equal(value);
  });

  it('calls signInReq with the email and password values', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<SignIn signInReq={spy} />);
    const email = 'jake@example.com';
    const password = 'password';
    wrapper.find('input.spec-email-field').simulate('change', { target: { value: email } });
    wrapper.find('input.spec-password-field').simulate('change', { target: { value: password } });

    wrapper.find('.spec-submit-button').simulate('click');
    expect(spy.args[0][0]).to.deep.equal({ email, password });
  });

  it('can submit onEnter', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<SignIn signInReq={spy} />);

    wrapper.find('input.spec-password-field').simulate('keypress', { key: 'Enter' });
    expect(spy.calledOnce).to.be.true;
  });
});