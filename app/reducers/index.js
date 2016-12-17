import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { dialogReducer } from 'redux-dialog';

import merge from 'lodash/merge';

import { reducer as entitiesReducer } from 'reducers/Entities';
import { reducer as formErrorsReducer } from 'reducers/FormErrors';

import { reducer as authReducer } from 'services/authentication/reducer';
import { reducer as flashReducer } from 'services/flash/reducer';

const services = combineReducers({
    auth:  authReducer,
    flash: flashReducer,
});

export const reducer = combineReducers({
    entities:   entitiesReducer,
    services,
    formErrors: formErrorsReducer,
    routing:    routerReducer,
    dialogs:    dialogReducer,
});

export default reducer;