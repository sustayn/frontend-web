import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { FlashMessage } from 'services/flash/Components/FlashMessage';

describe('Services | Flash | Components | FlashMessage', function() {
  it('has an inactive modifier if no flashObject in the queue', function() {
    const wrapper = shallow(<FlashMessage flashObject={({})} />);
    const mainDiv = wrapper.find('.spec-flash-wrapper');

    expect(mainDiv.props().className).to.include('is-inactive');
  });

  it('adds the type as a class modifier', function() {
    const type = 'error';
    const wrapper = shallow(<FlashMessage flashObject={({ type })} />);
    const mainDiv = wrapper.find('.spec-flash-wrapper');

    expect(mainDiv.props().className).to.include(`is-${type}`);
  });

  it('displays the flash object message', function() {
    const message = 'test';
    const wrapper = shallow(<FlashMessage flashObject={({ message })} />);
    const mainDiv = wrapper.find('.spec-flash-message');

    expect(mainDiv.text()).to.equal(message);
  });

  it('lets the user dismiss the message using the pop action', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<FlashMessage flashObject={({})} dismissFlash={spy} />);

    wrapper.find('.spec-flash-dismiss').simulate('click');
    expect(spy.calledOnce).to.be.true;
  });
});