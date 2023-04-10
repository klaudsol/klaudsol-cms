import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import People from '@klaudsol/commons/models/People';

async function handler(req, res) {
    try {
        const { firstName, lastName, loginEnabled, email, password, confirmPassword, forcePasswordChange } = req.body;

        if (!firstName) throw new InsufficientDataError('Please enter your first name.');
        if (!lastName) throw new InsufficientDataError('Please enter your last name.');
        if (!email) throw new InsufficientDataError('Please enter your email.');
        if (!password) throw new InsufficientDataError('Please enter your first password.');
        if (!confirmPassword) throw new InsufficientDataError('Please confirm your password.');
        if (password !== confirmPassword) throw new InsufficientDataError('The passwords do not match.');

        await People.createUser({ firstName, lastName, loginEnabled, email, password, forcePasswordChange });

        res.status(OK).json({ message: 'test' });

    } catch (error) {
        await defaultErrorHandler(error, req, res);
    }
}

// No need for withSession since we're signing up
export default handler;
