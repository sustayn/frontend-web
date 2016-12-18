import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ForgotPassword } from 'services/authentication/Components/ForgotPassword';

describe('Service | Authentication | Component | ForgotPassword', () => {
  it('has an input field with type email', function() {
    const wrapper = shallow(<ForgotPassword />);
    const input = wrapper.find('input');

    expect(input).to.have.length(1);
    expect(input.props().type).to.equal('email');
  });

  it('sets the state on input change', function() {
    const wrapper = shallow(<ForgotPassword />);
    const value = 'test';
    wrapper.find('input').simulate('change', { target: { value } });

    expect(wrapper.state('email')).to.equal(value);
  });

  it('calls forgotPasswordReq with the email input value', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<ForgotPassword forgotPasswordReq={spy} />);
    const value = 'test';
    wrapper.find('input').simulate('change', { target: { value } });

    wrapper.find('.spec-submit-button').simulate('click');
    expect(spy.args[0][0]).to.equal(value);
  });

  it('can submit onEnter', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<ForgotPassword forgotPasswordReq={spy} />);

    wrapper.find('input').simulate('keypress', { key: 'Enter' });
    expect(spy.calledOnce).to.be.true;
  });
});