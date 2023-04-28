import { withSession } from '@klaudsol/commons/lib/Session';
import { handleRequests } from '@klaudsol/commons/lib/API';
import { OK } from '@klaudsol/commons/lib/HttpStatuses';
import Session from '@klaudsol/commons/models/Session';
import People from '@klaudsol/commons/models/People';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import UserAlreadyExists from "@klaudsol/commons/errors/UserAlreadyExists";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { editProfile } from '@/lib/Constants';

export default withSession(handleRequests({ put }));

async function put(req, res) {
    await assertUserCan(editProfile, req);
    const { firstName, lastName, email, isSameEmail } = req.body;

    if (!firstName) throw new InsufficientDataError('Please enter your first name.');
    if (!lastName) throw new InsufficientDataError('Please enter your last name.');
    if (!email) throw new InsufficientDataError('Please enter your email.');

    if (!isSameEmail) {
        const existingUser = await People.findByColumn('email', email);

        if (existingUser) throw new UserAlreadyExists();
    }

    const sessionToken = req?.user?.sessionToken ?? req?.session?.session_token;

    const session = await Session.getSession(sessionToken);
    const userInfo = {
        id: session.people_id,
        loginEnabled: true,
        approved: true,
        forcePasswordChange: false,
        firstName,
        lastName,
        email
    }

    await People.updateUserInfo(userInfo);

    const { origin } = req.headers;
    const isFromCMS = origin && (origin !== process.env.FRONTEND_URL);

    if (isFromCMS) {
        req.session.cache = {
            ...req.session.cache,
        };
        await req.session.save();
    }

    res.status(OK).json({ message: 'User info updated.', values: { firstName, lastName, email } });
}
