import server from '../Server';
import Response from '../Response';
import logWrapper from '../utils/logWrapper';

server.setNamespace('/auth');

// Register
server.post('/', (db, req) => {
  const { firstName, lastName, email, roles, careTeamId } = req.parsedBody;

  if(!email) {
    return new Response({ status: 'error', errors: ['Please submit an email with the request data'] }, {}, 401);
  } else {
    const _confirmationCode = (Math.random() + 1).toString(36).substr(2, 5);
    logWrapper(`An email has been sent to ${email}. Follow the link http://localhost:8080/auth/activate?confirmation_token=${_confirmationCode}`);
    const user = db.users.create({
      firstName,
      lastName,
      email,
      careTeamId,
      roles,
      _confirmationCode,
    });
    const userRegistration = db.userRegistrations.create({
      firstName,
      lastName,
      email,
      roles,
      userId: user.id,
    });
    window.localStorage.setItem('mirage.confirmationCode', _confirmationCode);

    req.queryParams.include = 'user';
    return userRegistration;
  }
}, 200);

// Activate
server.post('/activate', (db, req) => {
  const { confirmation_token, password, password_confirmation, ...body } = req.parsedBody;
  const user = db.users.where({ _confirmationCode: confirmation_token })[0];

  if(!user || !password || !password_confirmation || password !== password_confirmation || password.length < 8) {
    return new Response({ status: 'error', errors: ['Please submit proper activation data in request body.'] }, {}, 401);
  } else {
    db.users.update(user.id, body);

    return new Response({
      success: true,
      data:    { id: user.id, ...server.getModelAttributes(user) },
    }, {
      'access-token': user._accessToken,
      'expiry':       user._expiry,
      'token-type':   'Bearer',
      'client':       user._client,
      'uid':          user.email,
    }, 200);
  }
});

// Delete account
server.delete('/', (db, req) => {
  const headers = req.requestHeaders;
  const _accessToken = headers['access-token'];
  const _client = headers.client;
  const email = headers.uid;

  const user = db.users.where({ _accessToken, _client, email })[0];

  if(!user) {
    return new Response({ errors: ['User not found'] }, {}, 404);
  } else {
    db.users.destroy(user.id);
    return { success: true };
  }
}, 200);

// Update account
server.put('/', (db, req) => {
  const { uid } = req.requestHeaders;

  const user = db.users.where({ email: uid })[0];

  if(!user) {
    return new Response({ status: 'error', errors: ['User not found'] }, {}, 404);
  } else {
    db.users.update(user.id, req.parsedBody);
    return {
      status: 'success',
      data:   { id: user.id, ...server.getModelAttributes(user) },
    };
  }
}, 200);

// Log in
server.post('/sign_in', (db, req) => {
  const { email, password } = req.parsedBody;

  const user = db.users.where({ email })[0];

  if(!user || user.encryptedPassword !== password) {
    return new Response({ errors: ['Invalid login credentials. Please try again.'] }, {}, 401);
  } else {
    return new Response({
      data: { id: user.id, careTeamId: user.careTeamId, ...server.getModelAttributes(user) },
    }, {
      'token-type':   'Bearer',
      'uid':          user.email,
      'access-token': user._accessToken,
      'client':       user._client,
      'expiry':       user._expiry,
    }, 200);
  }
});

// Log out
server.delete('/sign_out', (db, req) => {
  return { success: true };
}, 200);

// Validate existing token
server.get('/validate_token', (db, req) => {
  const headers = req.requestHeaders;
  const _accessToken = headers['access-token'];
  const _client = headers.client;
  const email = headers.uid;

  const user = db.users.where({ _accessToken, _client, email })[0];

  if(!user) {
    return new Response({ success: false, errors: ['Invalid Token'] }, {}, 401);
  } else {
    return new Response({
      success: true,
      data:    { id: user.id, careTeamId: user.careTeamId, ...server.getModelAttributes(user) },
    }, {
      'token-type':   'Bearer',
      'uid':          user.email,
      'access-token': user._accessToken,
      'client':       user._client,
      'expiry':       user._expiry,
    }, 200);
  }
});

// Use to send a password reset confirmation email
server.post('/password', (db, req) => {
  const { email } = req.parsedBody;
  const user = db.users.where({ email })[0];

  if(!user) {
    return new Response({ success: false, errors: ['You must provide an email address.'] }, {}, 401);
  } else {
    const _resetPasswordToken = (Math.random() + 1).toString(36).substr(2, 5);
    logWrapper(`An email has been sent to ${email}. Follow the link http://localhost:8080/auth/password-reset?reset_password_token=${_resetPasswordToken}`);
    db.users.update(user.id, { _resetPasswordToken });
    window.localStorage.setItem('mirage.resetPasswordToken', _resetPasswordToken);

    return {
      success: true,
      message: `An email has been sent to '${user.email}' containing instructions for resetting your password.`,
    };
  }
}, 200);

// Not implemented in the backend
// // Use to change a user's password
// server.put('/password', (db, req) => {
//     const { password, password_confirmation } = req.parsedBody;
//     const { uid } = req.requestHeaders;
//     const user = db.users.where({ email: uid })[0];

//     if(!password || !password_confirmation || !user || password !== password_confirmation) {
//         return new Response({ success: false, errors: ['Unauthorized'] });
//     } else {
//         db.users.update(user.id, { encryptedPassword: password });
//         return {
//             success: true,
//             message: 'Your password has been successfully updated.',
//             user:    { id: user.id, ...server.getModelAttributes(user) },
//         };
//     }
// }, 200);

// Use to reset a user's password
server.put('/password', (db, req) => {
  const { password, password_confirmation, reset_password_token } = req.parsedBody;
  const user = db.users.where({ _resetPasswordToken: reset_password_token })[0];

  if(!password || !password_confirmation || !user || password !== password_confirmation) {
    return new Response({ success: false, errors: ['Unauthorized'] });
  } else {
    db.users.update(user.id, { encryptedPassword: password });
    return {
      success: true,
      data:    { id: user.id, ...server.getModelAttributes(user) },
    };
  }
}, 200);

server.setNamespace('');

export default server;