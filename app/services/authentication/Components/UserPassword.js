import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePasswordReq } from 'services/authentication/actions';
import getPasswordErrors from 'services/authentication/utils/getPasswordErrors';

import Button from 'grommet/components/Button';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updatePasswordReq }, dispatch);
};

export class UserPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { passwordErrors: null };
    }

    submit() {
        const { password, password_confirmation } = this.state;

        const passwordErrors = getPasswordErrors(password, password_confirmation);
        if(passwordErrors) {
            this.setState({ passwordErrors });
        } else {
            this.props.updatePasswordReq({ password, password_confirmation});
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

export default connect(() => ({}), mapDispatchToProps)(UserPassword);