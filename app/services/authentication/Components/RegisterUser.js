import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerReq } from 'services/authentication/actions';

import Button from 'grommet/components/Button';

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ registerReq }, dispatch);
};

export class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submit() {
    const { email } = this.state;
    this.props.registerReq(email);
  }

  checkKeyPress(e) {
    if(e.key === 'Enter') this.submit();
  }

  render() {
    return (
      <div>
        <input
          type='email'
          placeholder='email'
          onKeyPress={this.checkKeyPress.bind(this)}
          onChange={(e) => { this.setState({ email: e.target.value }); }}
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

export default connect(() => ({}), mapDispatchToProps)(RegisterUser);