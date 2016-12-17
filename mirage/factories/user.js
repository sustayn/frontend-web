import Factory from './Factory';
import faker from 'faker';

const User = new Factory('user', {
    firstName:         faker.name.firstName,
    lastName:          faker.name.lastName,
    email:             faker.internet.email,
    encryptedPassword: faker.internet.password,
    createdAt:         faker.date.recent,
    updatedAt:         faker.date.recent,

    _accessToken: () => faker.random.uuid(),
    // Set the expiry 4 hours from now
    _expiry:      () => { return parseInt(new Date().getTime() / 1000) + 60 * 60 * 4; },
    _client:      () => faker.random.uuid(),
});

export default User;