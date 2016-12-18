import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetPasswordReq } from 'services/authentication/actions';
import getPasswordErrors from 'services/authentication/utils/getPasswordErrors';
import { AuthConfig } from 'app/config';

import Button from 'grommet/components/Button';

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ resetPasswordReq }, dispatch);
};

export class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { passwordErrors: null };
  }

  submit() {
    const { password, password_confirmation } = this.state;
    const passwordErrors = getPasswordErrors(password, password_confirmation);

    if(passwordErrors) {
      this.setState({ passwordErrors });
    } else if(this.props.pathname !== AuthConfig.resetRoute) {
      this.setState({ passwordErrors: 'Unable to reset password. Not at the correct reset route' });
    } else if(!this.props.resetPasswordToken) {
      this.setState({ passwordErrors: 'Unable to locate the password reset token' });
    } else {
      this.props.resetPasswordReq({ password, password_confirmation, reset_password_token: this.props.resetPasswordToken });
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
          label='Update Password'
          onClick={this.submit.bind(this)}
        />
      </div>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(ResetPassword);