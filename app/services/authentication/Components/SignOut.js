import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signOutReq } from 'services/authentication/actions';

import Button from 'grommet/components/Button';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ signOutReq }, dispatch);
};

export const SignOut = ({ signOutReq }) => (
    <a className='navbar_link spec-signout-button' onClick={signOutReq}>
        Sign Out
    </a>
);

export default connect(() => ({}), mapDispatchToProps)(SignOut);