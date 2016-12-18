import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import RegisterUser from 'views/partials/RegisterUser';

describe('Views | Partials | RegisterUser', function() {
  beforeEach(function() {
    this.wrapper = shallow(<RegisterUser />);
  });

  it('sets the state on first name change', function() {
    const value = 'test';
    this.wrapper.find('input.spec-first-name').simulate('change', { target: { value } });

    expect(this.wrapper.state('firstName')).to.equal(value);
  });

  it('sets the state on last name change', function() {
    const value = 'test';
    this.wrapper.find('input.spec-last-name').simulate('change', { target: { value } });

    expect(this.wrapper.state('lastName')).to.equal(value);
  });

  it('sets the state on email change', function() {
    const value = 'test';
    this.wrapper.find('input.spec-email').simulate('change', { target: { value } });

    expect(this.wrapper.state('email')).to.equal(value);
  });

  it('sets the state by selecting roles', function() {
    expect(this.wrapper.find('.spec-viewer').props().checked).to.be.false;
    expect(this.wrapper.find('.spec-clinician').props().checked).to.be.false;
    expect(this.wrapper.find('.spec-care-team-admin').props().checked).to.be.false;

    this.wrapper.find('.spec-viewer').simulate('change');
    expect(this.wrapper.find('.spec-viewer').props().checked).to.be.true;

    this.wrapper.find('.spec-clinician').simulate('change');
    expect(this.wrapper.find('.spec-clinician').props().checked).to.be.true;

    this.wrapper.find('.spec-viewer').simulate('change');
    expect(this.wrapper.find('.spec-viewer').props().checked).to.be.false;
    expect(this.wrapper.find('.spec-clinician').props().checked).to.be.true;

    this.wrapper.find('.spec-care-team-admin').simulate('change');
    expect(this.wrapper.find('.spec-care-team-admin').props().checked).to.be.true;

    expect(this.wrapper.state('roles')).to.deep.equal(['clinician', 'care_team_admin']);
  });

  it('calls submitAction with the attributes', function() {
    const spy = sinon.spy();
    const wrapper = shallow(<RegisterUser submitAction={spy} />);
    const firstName = 'The';
    const lastName = 'Dude';
    const email = 'dude@example.com';
    const roles = ['viewer', 'clinician'];
    wrapper.find('input.spec-first-name').simulate('change', { target: { value: firstName } });
    wrapper.find('input.spec-last-name').simulate('change', { target: { value: lastName } });
    wrapper.find('input.spec-email').simulate('change', { target: { value: email } });
    roles.forEach((role) => { wrapper.find(`.spec-${role}`).simulate('change'); });

    wrapper.find('.spec-submit-button').simulate('click');
    expect(spy.args[0][0]).to.deep.equal({ firstName, lastName, email, roles });
  });

  it('includes the care team id in the request if provided', function() {
    const spy = sinon.spy();
    const careTeamId = 42;
    const wrapper = shallow(<RegisterUser submitAction={spy} careTeamId={careTeamId} />);

    wrapper.find('.spec-submit-button').simulate('click');
    expect(spy.args[0][0].careTeamId).to.equal(careTeamId);
  });
});