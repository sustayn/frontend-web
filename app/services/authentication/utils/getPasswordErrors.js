export default function getPasswordErrors(password, passwordConfirmation) {
    if(!password || password.trim().length === 0) return 'Password is required';
    if(!passwordConfirmation || passwordConfirmation.trim().length <= 0) return 'Password confirmation is required';

    if(password.trim().length < 8) return 'Password must be at least 8 characters';
    if(password !== passwordConfirmation) return 'Password must match with password confirmation';

    return null;
}