export const initialState = {
  entities: {
  },
  services: {
    auth: {
      isAuthenticated: true,
      currentUser:     {
        id:        1,
        firstName: 'Jake',
        lastName:  'Dluhy',
        email:     'jake@example.com',
        createdAt: '2016-11-31T16:05:56.152Z',
        updatedAt: '2016-11-31T21:50:26.331Z',
      },
    },
    flash: [],
  },
  formErrors: {},
  routing:    { /* redux-router */ },
};