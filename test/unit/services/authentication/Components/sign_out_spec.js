import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { SignOut } from 'services/authentication/Components/SignOut';

describe('Service | Authentication | Component | SignOut', () => {
  it('calls signOutReq on button click', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<SignOut signOutReq={spy} />);

    wrapper.find('.spec-signout-button').simulate('click');
    expect(spy.calledOnce).to.be.true;
  });
});