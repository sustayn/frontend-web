import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { RegisterUser } from 'services/authentication/Components/RegisterUser';

describe('Service | Authentication | Component | RegisterUser', () => {
  it('has an input field with type email', function() {
    const wrapper = shallow(<RegisterUser />);
    const input = wrapper.find('input');

    expect(input).to.have.length(1);
    expect(input.props().type).to.equal('email');
  });

  it('sets the state on input change', function() {
    const wrapper = shallow(<RegisterUser />);
    const value = 'test';
    wrapper.find('input').simulate('change', { target: { value } });

    expect(wrapper.state('email')).to.equal(value);
  });

  it('calls registerReq with the email input value', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<RegisterUser registerReq={spy} />);
    const value = 'test';
    wrapper.find('input').simulate('change', { target: { value } });

    wrapper.find('.spec-submit-button').simulate('click');
    expect(spy.args[0][0]).to.equal(value);
  });

  it('can submit with onEnter', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<RegisterUser registerReq={spy} />);
    wrapper.find('input').simulate('change', { target: { value: 'test' } });

    wrapper.find('input').simulate('keypress', { key: 'Enter' });
    expect(spy.calledOnce).to.be.true;
  });
});