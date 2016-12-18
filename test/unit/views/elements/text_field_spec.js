import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { TextField } from 'views/elements/TextField';

import FormField from 'grommet/components/FormField';

describe('Views | Partials | TextField', function() {
  it('renders a form field with the passed in label', function() {
    const label = 'test';
    const wrapper = shallow(<TextField label={label} />);

    expect(wrapper.find(FormField).props().label).to.equal(label);
  });

  it('renders an error label', function() {
    const label = 'label';
    const error = 'error';
    const wrapper = shallow(<TextField label={label} error={error} />);

    expect(wrapper.find('.spec-text-field-err').text()).to.equal(`${label} ${error}`);
  });

  it('does not render the error label if no error', function() {
    const wrapper = shallow(<TextField error={undefined} />);

    expect(wrapper.find('.spec-text-field-err')).to.have.length(0);
  });

  it('does not render the required tag if prop is not passed in', function() {
    const wrapper = shallow(<TextField />);

    expect(wrapper.find('.spec-text-field-req')).to.have.length(0);
  });

  it('renders the required tag if prop is passed in', function() {
    const wrapper = shallow(<TextField required />);

    expect(wrapper.find('.spec-text-field-req')).to.have.length(1);
    expect(wrapper.find('.spec-text-field-req').text()).to.equal('Required');
  });

  it('renders an input tag with passed in props (without label, error, required)', function() {
    const props = { test1: 'one', test2: 'two' };
    const wrapper = shallow(<TextField label={'foo'} error={'bar'} required {...props} />);

    expect(wrapper.find('input').props().test1).to.equal(props.test1);
    expect(wrapper.find('input').props().test2).to.equal(props.test2);
  });

  describe('onFieldChange', function() {
    it('calls onChange if the value is passed in as a property', function() {
      const spy = sinon.spy();
      const wrapper = shallow(<TextField onChange={spy} />);
      const event = { target: { value: 'new value' } };

      wrapper.find('input').simulate('change', event);
      expect(spy.args[0][0]).to.deep.equal(event);
    });

    it('calls removeError with name if all required props are passed in', function() {
      const spy = sinon.spy();
      const name = 'firstName';
      const error = 'is required';
      const wrapper = shallow(<TextField removeError={spy} name={name} error={error} />);

      wrapper.find('input').simulate('change', { target: { value: 'my val' } });
      expect(spy.args[0][0]).to.equal(name);
    });

    it('does not call removeError if name is not passed in', function() {
      const spy = sinon.spy();
      const error = 'is required';
      const wrapper = shallow(<TextField removeError={spy} error={error} />);

      wrapper.find('input').simulate('change', { target: { value: 'my val' } });
      expect(spy.notCalled).to.be.true;
    });

    it('does not call removeError if error is not passed in', function() {
      const spy = sinon.spy();
      const name = 'firstName';
      const error = 'is required';
      const wrapper = shallow(<TextField removeError={spy} name={name} error={undefined} />);

      wrapper.find('input').simulate('change', { target: { value: 'my val' } });
      expect(spy.notCalled).to.be.true;
    });

    it('does not error if removeError is not passed in', function() {
      const spy = sinon.spy();
      const name = 'firstName';
      const error = 'is required';
      const wrapper = shallow(<TextField onChange={spy} name={name} error={error} />);

      wrapper.find('input').simulate('change', { target: { value: 'my val' } });
      expect(spy.calledOnce).to.be.true;
    });
  });
});