import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { createHash } from '@/lib/Hash';
import { assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { OK, NOT_FOUND } from '@klaudsol/commons/lib/HttpStatuses';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import UserAlreadyExists from "@klaudsol/commons/errors/UserAlreadyExists";
import People from '@klaudsol/commons/models/People';
import PeopleGroups from '@klaudsol/commons/models/PeopleGroups';
import { readPendingUsers, readUsers, writeGroups, writeUsers } from "@/lib/Constants";

export default withSession(handleRequests({ get, post }));

async function get(req, res) {
    const { approved, pending } = req.query;

    if ((!approved && !pending) || approved) await assertUserCan(readUsers, req);
    if (pending) await assertUserCan(readPendingUsers, req);

    const people = await People.getAll({ approved, pending });

    const output = {
        data: people,
        metadata: {},
    };

    output.metadata.hash = createHash(output);

    people ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function post(req, res) {

    const { 
        firstName, 
        lastName, 
        email, 
        password, 
        confirmPassword, 
        groups = [], 
        approved = false,
        loginEnabled = false, 
        forcePasswordChange = false 
    } = req.body;

    await assertUserCan(writeUsers, req);
    if (groups.length > 0) await assertUserCan(writeGroups, req);

    if (!firstName) throw new InsufficientDataError('Please enter your first name.');
    if (!lastName) throw new InsufficientDataError('Please enter your last name.');
    if (!email) throw new InsufficientDataError('Please enter your email.');
    if (!password) throw new InsufficientDataError('Please enter your first password.');
    if (!confirmPassword) throw new InsufficientDataError('Please confirm your password.');
    if (password !== confirmPassword) throw new InsufficientDataError('The passwords do not match.');

    const existingUser = await People.findByColumn('email', email);

    if (existingUser) throw new UserAlreadyExists();

    const id = await People.createUser({ firstName, lastName, loginEnabled, approved, email, password, forcePasswordChange });

    if (groups.length > 0) await PeopleGroups.connect({ id, groups });

    res.status(OK).json({ message: 'Signup successful!' });
}
