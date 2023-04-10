import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { createHash } from '@/lib/Hash';
import { OK, NOT_FOUND } from '@klaudsol/commons/lib/HttpStatuses';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import UserAlreadyExists from "@klaudsol/commons/errors/UserAlreadyExists";
import People from '@klaudsol/commons/models/People';

export default withSession(handleRequests({ get, post }));

async function get(req, res) {
    const { approved, pending } = req.query;

    let people;
    if (approved) {
        people = await People.getAll({ loginEnabled: true });
    } else if (pending) {
        people = await People.getAll({ loginEnabled: false });
    }

    const output = {
        data: people,
        metadata: {},
    };

    output.metadata.hash = createHash(output);

    people ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function post(req, res) {
    const { firstName, lastName, loginEnabled, email, password, confirmPassword, forcePasswordChange } = req.body;

    if (!firstName) throw new InsufficientDataError('Please enter your first name.');
    if (!lastName) throw new InsufficientDataError('Please enter your last name.');
    if (!email) throw new InsufficientDataError('Please enter your email.');
    if (!password) throw new InsufficientDataError('Please enter your first password.');
    if (!confirmPassword) throw new InsufficientDataError('Please confirm your password.');
    if (password !== confirmPassword) throw new InsufficientDataError('The passwords do not match.');

    const existingUser = await People.findByColumn('email', email);

    if (existingUser) throw new UserAlreadyExists();

    await People.createUser({ firstName, lastName, loginEnabled, email, password, forcePasswordChange });

    res.status(OK).json({ message: 'Signup successful!' });
}

