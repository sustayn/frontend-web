import db from './Database';

// Create the current user
const currentUserAttrs = Object.assign({}, {
    firstName:         'Jake',
    lastName:          'Dluhy',
    email:             'jake@example.com',
    encryptedPassword: 'password',
    careTeamId:        1,
}, getDataFromStorage());

// Create the registered, non activated user
if(window.localStorage.getItem('mirage.confirmationCode')) {
    db.create('user', {
        email:             'andrew@example.com',
        _confirmationCode: window.localStorage.getItem('mirage.confirmationCode'),
    });
}

if(window.localStorage.getItem('mirage.resetPasswordToken')) {
    db.create('user', {
        email:               'andrewf@example.com',
        _resetPasswordToken: window.localStorage.getItem('mirage.resetPasswordToken'),
    });
}

db.create('user', currentUserAttrs);
const users = db.createList('user', 5);

export default db;

/**
 * Basically, in order to successfully represent session storage maintenance of sign in state,
 * mirage needs to access session/local storage and set the first users accessToken, expiry and client
 * to what is stored
 */
function getDataFromStorage() {
    let storage;
    if(window.sessionStorage.getItem('access-token')) {
        storage = window.sessionStorage;
    } else if(window.localStorage.getItem('access-token')) {
        storage = window.localStorage;
    } else {
        return {};
    }

    return {
        _accessToken: storage.getItem('access-token'),
        _expiry:      storage.getItem('expiry'),
        _client:      storage.getItem('client'),
    };
}