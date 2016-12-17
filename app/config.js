import merge from 'lodash/merge';
import { checkForElectron } from './utils/checkEnv';

/**
 * Generic environment configuration
 */

export const Env = {
    isProduction: process.env.NODE_ENV === 'production',
};


/**
 * Development environment configuration
 *
 * Make useDevEnv falsy to easily disable this
 *
 * It is currently used in 3 places:
 * store (to push startingRoute)
 * Root-dev (to check initialSate)
 * AuthConfig (to disable a sign-out action from firing)
 *
 * Note: As is, this prevents the sign-out action from being able to fire.
 * This must be disabled for any development surrounding sign-in/sign-out.
 * While not ideal, since this is a development-specific feature, it seems okay.
 */

/* TODO: better control here */
const useDevEnv = (process.env.NODE_ENV === 'development');
export const DevEnv =
    useDevEnv ? {
        startingRoute:      '/',
        autoLogin:          true,
        acceptInitialState: true, /* Note: autoLogin currently requires acceptInitialState to be true */
    } : {};


/**
 * Config for RxAjax Service
 */

// BASE_URL should be provided as part of the build process
const baseUrl = process.env.BASE_URL || '';

// Essentially, we want to get the subdomain. Unfortunately, there is no guaranteed way to get the
// subdomain. This is a pretty decent way, assuming that we don't have a multitiered subdomain (some.thing.aveera.com)
// and we operate on .com, not .co.uk or some BS like that
const hostnameParts = window.location.hostname.split('.');
const subdomain = getSubdomain();
export const RxAjaxConfig = {
    headers: {
        'Content-Type': 'application/json',
        'token-type':   'Bearer',
    },
    baseUrl: `${baseUrl}/v1${subdomain}`,
    afterRequest(response) {
        const headersObj = storeAndGetResponseHeaders(response.xhr);
        this.headers = merge({}, this.defaultHeaders, headersObj);

        return response;
    },
};

function storeAndGetResponseHeaders(xhr) {
    const keys = ['access-token', 'client', 'expiry', 'uid', 'token-type'];
    const headersObj = {};

    keys.filter((key) => xhr.getResponseHeader(key))
    .forEach((key) => {
        headersObj[key] = xhr.getResponseHeader(key);
        AuthConfig.storage.setItem(key, xhr.getResponseHeader(key));
    });

    return headersObj;
}

// Pass in the domain name for the server as part of the build process, and replace that out to get the subdomain
// Return /metamason by default to avoid errors
function getSubdomain() {
    if(process.env.DOMAIN_NAME) {
        const subdomain = window.location.hostname.replace(process.env.DOMAIN_NAME, '').replace(/\.$/, '');
        if(subdomain.length > 0) return `/${subdomain}`;
    }
    return '/metamason';
}


/**
 * Config for Auth Service
 */

export const AuthConfig = {
    storage:       window.sessionStorage,
    registerRoute: '/auth/register',
    forgotRoute:   '/auth/forgot-password',
    resetRoute:    '/auth/password-reset',
    activateRoute: '/auth/activate',
    signinRoute:   '/auth/signin',

    /*
     * useDevEnv is defined in the DevEnv section above
     * The assignment is repeated here so that the Auth Service doesn't depend upon DevEnv
     * If autoLogin is true, the sign-out action does not work correctly
     */
    autoLogin: useDevEnv,
};


/**
 * Config for Authorization Service
 */

export const AuthorizationConfig = {
    authSelector: (state) => state.services.auth,
};


/**
 * Config for Logging Service (with Keen info)
 */

const keenDevProjectId = '';
const keenDevWriteKey = '';
export const LoggingConfig = {
    keenErrorConfig: {
        projectId: process.env.KEEN_ERROR_PROJECT_ID || keenDevProjectId,
        writeKey:  process.env.KEEN_ERROR_WRITE_KEY || keenDevWriteKey,
        // requestType: 'xhr',
    },
    keenAnalyticsConfig: {
        projectId: process.env.KEEN_ANALYTICS_PROJECT_ID || keenDevProjectId,
        writeKey:  process.env.KEEN_ANALYTICS_WRITE_KEY || keenDevWriteKey,
        // requestType: 'xhr',
    },
    logAnalyticsDev: false,
};
