import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signInReq } from 'services/authentication/actions';

import Button from 'grommet/components/Button';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ signInReq }, dispatch);
};

export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        const { email, password } = this.state;
        this.props.signInReq({ email, password });
    }

    checkKeyPress(e) {
        if(e.key === 'Enter') this.submit();
    }

    render() {
        return (
            <div>
                <input
                    className='spec-email-field'
                    type='email'
                    placeholder='email'
                    onChange={(e) => { this.setState({ email: e.target.value }); }}
                />
                <input
                    className='spec-password-field'
                    type='password'
                    placeholder='password'
                    onKeyPress={this.checkKeyPress.bind(this)}
                    onChange={(e) => { this.setState({ password: e.target.value }); }}
                />
                <Button
                    className='spec-submit-button'
                    label='Sign In'
                    onClick={this.submit.bind(this)}
                />
            </div>
        );
    }
}

export default connect(() => ({}), mapDispatchToProps)(SignIn);