import { expect } from 'chai';

import getPasswordErrors from 'services/authentication/utils/getPasswordErrors';

describe('Service | Authentication | Util | getPasswordErrors', () => {
    it('returns an error if password is not provided', () => {
        expect(getPasswordErrors('', '')).to.equal('Password is required');
    });

    it('returns an error if password confirmation is not provided', () => {
        expect(getPasswordErrors('password', '')).to.equal('Password confirmation is required');
    });

    it('returns an error if password is less than 8 characters', () => {
        expect(getPasswordErrors('passwo', 'passwo')).to.equal('Password must be at least 8 characters');
    });

    it('returns an error if password does not match password confirmation', () => {
        expect(getPasswordErrors('password', 'passwo')).to.equal('Password must match with password confirmation');
    });

    it('returns null if the password is valid', () => {
        expect(getPasswordErrors('password', 'password')).to.be.null;
    });
});