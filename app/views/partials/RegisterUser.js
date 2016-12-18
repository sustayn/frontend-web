import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import filter from 'lodash/filter';

import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';

class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = { firstName: '', lastName: '', email: '', roles: [] };
  }

  submit() {
    const { firstName, lastName, email, roles } = this.state;
    const body = { firstName, lastName, email, roles };
    if(this.props.careTeamId) body.careTeamId = this.props.careTeamId;

    this.props.submitAction(body);
  }

  toggleRole(role) {
    const roles = this.state.roles;
    const newRoles = roles.includes(role) ? filter(roles, (val) => val !== role) : [...roles, role];
    this.setState({ roles: newRoles });
  }

  render() {
    return (
      <div>
        <input
          type='text'
          placeholder='First Name'
          className='spec-first-name'
          value={this.state.firstName}
          onChange={(e) => { this.setState({ firstName: e.target.value }); }}
        />
        <input
          type='text'
          placeholder='Last Name'
          className='spec-last-name'
          value={this.state.lastName}
          onChange={(e) => { this.setState({ lastName: e.target.value }); }}
        />
        <input
          type='email'
          placeholder='Email'
          className='spec-email'
          value={this.state.email}
          onChange={(e) => { this.setState({ email: e.target.value }); }}
        />
        <CheckBox
          label='Viewer'
          className='spec-viewer'
          checked={this.state.roles.includes('viewer')}
          onChange={this.toggleRole.bind(this, 'viewer')}
        />
        <CheckBox
          label='Clinician'
          className='spec-clinician'
          checked={this.state.roles.includes('clinician')}
          onChange={this.toggleRole.bind(this, 'clinician')}
        />
        <CheckBox
          label='Care Team Admin'
          className='spec-care-team-admin'
          checked={this.state.roles.includes('care_team_admin')}
          onChange={this.toggleRole.bind(this, 'care_team_admin')}
        />
        <Button
          className='spec-submit-button'
          label='Register User'
          onClick={this.submit.bind(this)}
        />
      </div>
    );
  }
}

export default RegisterUser;