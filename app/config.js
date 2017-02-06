import merge from 'lodash/merge';

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
    autoLogin:          false,
    acceptInitialState: false, /* Note: autoLogin currently requires acceptInitialState to be true */
  } : {};

/**
 * Config for Auth Service
 */

export const AuthConfig = {
  storage:       window.localStorage,
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
 * Config for RxAjax Service
 */

// BASE_URL should be provided as part of the build process
const baseUrl = process.env.BASE_URL || '';
const headerKeys = ['access-token', 'client', 'expiry', 'uid', 'token-type'];

export const RxAjaxConfig = {
  headers: getHeaders(),
  baseUrl: `${baseUrl}/api/v1`,
  afterRequest(response) {
    const headersObj = storeAndGetResponseHeaders(response.xhr);
    this.headers = merge({}, this.headers, headersObj);

    return response;
  },
};

function storeAndGetResponseHeaders(xhr) {
  const headersObj = {};

  headerKeys.filter((key) => xhr.getResponseHeader(key))
  .forEach((key) => {
    headersObj[key] = xhr.getResponseHeader(key);
    AuthConfig.storage.setItem(key, xhr.getResponseHeader(key));
  });

  return headersObj;
}

function getHeaders() {
  const storedHeaders = {};

  headerKeys.filter((key) => AuthConfig.storage.getItem(key))
  .forEach((key) => {
    storedHeaders[key] = AuthConfig.storage.getItem(key);
  });

  return merge({}, {
    'Content-Type': 'application/json',
    'token-type':   'Bearer',
  }, storedHeaders);
}

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
