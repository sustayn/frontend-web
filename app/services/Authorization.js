import { UserAuthWrapper } from 'redux-auth-wrapper';
import { routerActions } from 'react-router-redux';
import merge from 'lodash/merge';

import { Env, AuthorizationConfig } from 'app/config';

const common = {
    authSelector:   AuthorizationConfig.authSelector,
    redirectAction: routerActions.replace,
};

// Authenticated
export function UserIsAuthenticated(component, options = {}) {
    const wrapper = UserAuthWrapper(merge({}, common, {
        predicate:           (auth) => auth.isAuthenticated,
        failureRedirectPath: '/auth/signin',
        wrapperDisplayName:  'UserIsAuthenticated',
    }, options));
    return options.FailureComponent !== undefined ? wrapper(() => component) : wrapper(component);
}

// Unauthenticated
export function UserIsNotAuthenticated(component, options = {}) {
    const wrapper = UserAuthWrapper(merge({}, common, {
        predicate:           (auth) => !auth.isAuthenticated,
        failureRedirectPath: '/dashboard',
        wrapperDisplayName:  'UserIsNotAuthenticated',
        allowRedirectBack:   false,
    }, options));
    return options.FailureComponent !== undefined ? wrapper(() => component) : wrapper(component);
}