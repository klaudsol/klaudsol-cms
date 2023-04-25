import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { createHash } from '@/lib/Hash';
import { deleteUsers, readUsers, writeUsers } from "@/lib/Constants";
import { assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { OK, NOT_FOUND } from '@klaudsol/commons/lib/HttpStatuses';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import UserAlreadyExists from "@klaudsol/commons/errors/UserAlreadyExists";
import People from '@klaudsol/commons/models/People';
import Groups from '@klaudsol/commons/models/Groups';
import PeopleGroups from '@klaudsol/commons/models/PeopleGroups';

export default withSession(handleRequests({ get, put, del }));

async function get(req, res) {
    assertUserCan(readUsers);

    const { id } = req.query;
    const person = await People.get({ id });
    const groups = await Groups.findByUser({ id });

    const output = {
        data: { person, groups },
        metadata: {},
    };

    output.metadata.hash = createHash(output);

    person ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function put(req, res) {
    assertUserCan(writeUsers);

    const { id } = req.query; 
    const { firstName, lastName, forcePasswordChange, loginEnabled, approved, email, isSameEmail, toAdd, toDelete } = req.body;

    if (!firstName) throw new InsufficientDataError('Please enter your first name.');
    if (!lastName) throw new InsufficientDataError('Please enter your last name.');
    if (!email) throw new InsufficientDataError('Please enter your email.');

    if (!isSameEmail) {
        const existingUser = await People.findByColumn('email', email);

        if (existingUser) throw new UserAlreadyExists();
    }

    await People.updateUserInfo({ id, firstName, lastName, forcePasswordChange, loginEnabled, approved, email });

    // If we approve a user, we automatically connect them with the "guest" group. But if we remove the "approve"
    // status of a user, and then approve them again, the program will associate the user with the "guest" group
    // again, making duplicates. 
    if (!approved) {
        await PeopleGroups.delete({ id });
    } else {
        if (toAdd.length > 0) await PeopleGroups.connect({ id, groups: toAdd });
        if (toDelete.length > 0) await PeopleGroups.disconnect({ id, groups: toDelete });
    }

    res.status(OK).json({ message: 'Update successful!' });
}

// Almost exactly the same code as DELETE /api/admin/users/pending
// The difference is the permission and the message
async function del(req, res) {
    assertUserCan(deleteUsers);

    const { id } = req.query;

    await People.delete({ id });
    await PeopleGroups.delete({ id });

    res.status(OK).json({ message: 'User deleted.' });
}


