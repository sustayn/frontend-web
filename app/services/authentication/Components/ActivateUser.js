import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { activateReq } from 'services/authentication/actions';
import getPasswordErrors from 'services/authentication/utils/getPasswordErrors';

import Button from 'grommet/components/Button';

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ activateReq }, dispatch);
};

export class ActivateUser extends Component {
  constructor(props) {
    super(props);
    this.state = { passwordErrors: null };
  }

  submit() {
    const { name, nickname, password, password_confirmation } = this.state;

    const passwordErrors = getPasswordErrors(password, password_confirmation);
    if(passwordErrors) {
      this.setState({ passwordErrors });
    } else {
      const signupAttrs = { password, password_confirmation };
      if(name) signupAttrs.name = this.state.name;
      if(nickname) signupAttrs.nickname = this.state.nickname;

      this.props.activateReq(signupAttrs);
    }
  }

  checkKeyPress(e) {
    if(e.key === 'Enter') this.submit();
  }

  render() {
    return (
      <div>
        <span className='spec-password-errors'>{this.state.passwordErrors}</span>
        <input
          className='spec-name-field'
          type='text'
          placeholder='name'
          onChange={(e) => { this.setState({ name: e.target.value }); }}
        />
        <input
          className='spec-nickname-field'
          type='text'
          placeholder='nickname'
          onChange={(e) => { this.setState({ nickname: e.target.value }); }}
        />
        <input
          className='spec-password-field'
          type='password'
          placeholder='password'
          onChange={(e) => { this.setState({ password: e.target.value }); }}
        />
        <input
          className='spec-confirmation-field'
          type='password'
          placeholder='password confirmation'
          onKeyPress={this.checkKeyPress.bind(this)}
          onChange={(e) => { this.setState({ password_confirmation: e.target.value }); }}
        />
        <Button
          className='spec-submit-button'
          label='Sign up'
          onClick={this.submit.bind(this)}
        />
      </div>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(ActivateUser);