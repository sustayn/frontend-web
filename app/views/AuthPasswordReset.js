import React from 'react';
import { connect } from 'react-redux';

import { ResetPassword } from 'services/authentication';
import parseQuery from 'utils/parseQuery';

const mapStateToProps = (state, ownProps) => {
    return {
        pathname:           ownProps.location.pathname,
        resetPasswordToken: parseQuery(ownProps.location.search).reset_password_token,
    };
};

export const AuthPasswordReset = ({ pathname, resetPasswordToken }) => (
    <ResetPassword
        pathname={pathname}
        resetPasswordToken={resetPasswordToken}
    />
);

export default connect(mapStateToProps, () => ({}))(AuthPasswordReset);