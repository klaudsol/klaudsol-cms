import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { createHash } from '@/lib/Hash';
import { OK, NOT_FOUND } from '@klaudsol/commons/lib/HttpStatuses';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import UserAlreadyExists from "@klaudsol/commons/errors/UserAlreadyExists";
import People from '@klaudsol/commons/models/People';

export default withSession(handleRequests({ get, put, patch, del }));

async function get(req, res) {
    const { id } = req.query;
    const person = await People.get({ id });

    const output = {
        data: person,
        metadata: {},
    };

    output.metadata.hash = createHash(output);

    person ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function put(req, res) {
    const { id } = req.query; const { firstName, lastName, loginEnabled, email } = req.body;

    if (!firstName) throw new InsufficientDataError('Please enter your first name.');
    if (!lastName) throw new InsufficientDataError('Please enter your last name.');
    if (!email) throw new InsufficientDataError('Please enter your email.');

    const existingUser = await People.findByColumn('email', email);

    if (existingUser) throw new UserAlreadyExists();

    await People.updateUserInfo({ id, firstName, lastName, loginEnabled, email });

    res.status(OK).json({ message: 'Update successful!' });
}

// patch is appropriate since we're not replacing the whole row
async function patch(req, res) {
    const { id } = req.query;

    await People.approve({ id });

    res.status(OK).json({ message: 'User approved.' });
}

async function del(req, res) {
    const { id } = req.query;

    await People.delete({ id });

    res.status(OK).json({ message: 'User rejected.' });
}

