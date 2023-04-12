import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { createHash } from '@/lib/Hash';
import { OK, NOT_FOUND } from '@klaudsol/commons/lib/HttpStatuses';
import Groups from '@klaudsol/commons/models/Groups';

export default withSession(handleRequests({ get, post }));

async function get(req, res) {
    const groups = await Groups.all();

    const output = {
        data: groups,
        metadata: {},
    };

    output.metadata.hash = createHash(output);

    groups ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function post(req, res) {
    // const { firstName, lastName, email, password, confirmPassword, loginEnabled = false, forcePasswordChange = false } = req.body;
    //
    // if (!firstName) throw new InsufficientDataError('Please enter your first name.');
    // if (!lastName) throw new InsufficientDataError('Please enter your last name.');
    // if (!email) throw new InsufficientDataError('Please enter your email.');
    // if (!password) throw new InsufficientDataError('Please enter your first password.');
    // if (!confirmPassword) throw new InsufficientDataError('Please confirm your password.');
    // if (password !== confirmPassword) throw new InsufficientDataError('The passwords do not match.');
    //
    // const existingUser = await People.findByColumn('email', email);
    //
    // if (existingUser) throw new UserAlreadyExists();
    //
    // await People.createUser({ firstName, lastName, loginEnabled, email, password, forcePasswordChange });
    //
    // res.status(OK).json({ message: 'Signup successful!' });
}




