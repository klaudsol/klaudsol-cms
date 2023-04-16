import People from '@klaudsol/commons/models/People';
import { withSession } from '@klaudsol/commons/lib/Session';
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import Session from '@klaudsol/commons/models/Session';
import { handleRequests } from '@klaudsol/commons/lib/API';
import { generateToken } from '@klaudsol/commons/lib/JWT';
import { canLogInToCms } from '@/lib/Constants';

const FRONTEND_URL = process.env.KS_FRONTEND_URL ?? process.env.FRONTEND_URL

export default withSession(handleRequests({ post, del }));

async function post(req, res) {
    const { email = null, password = null } = req.body;

    if (!email || !password) {
        res.status(UNPROCESSABLE_ENTITY).json({ message: "Please enter your username/password." });
        return
    }

    const { session_token, user: { firstName, lastName, capabilities, defaultEntityType, forcePasswordChange } } = await People.login(email, password);

    const token = generateToken({ firstName, lastName, email, capabilities, sessionToken: session_token });
    const response = { message: 'Sucessfully logged in!' };

    const { origin } = req.headers;
    const isFromCMS = origin !== FRONTEND_URL;

    if (isFromCMS) {
        const isAuthorized = capabilities.includes(canLogInToCms);
        const errorMessage = "You do not have permission to log in. Please contact your administrator."
        if (!isAuthorized) throw new UnauthorizedError(errorMessage);

        req.session.session_token = session_token;
        req.session.cache = {
            token,
            firstName,
            lastName,
            capabilities,
            defaultEntityType,
            homepage: '/admin',
            forcePasswordChange,
        };

        await req.session.save();

        response.forcePasswordChange = forcePasswordChange;
    } else {
        response.token = token;
    }

    res.status(OK).json(response);
}

async function del(req, res) {
    const { origin } = req.headers;
    const isFromCMS = origin !== FRONTEND_URL;

    const { sessionToken } = req.user;
    if (isFromCMS) req.session.destroy();

    await Session.logout(sessionToken);
    res.status(200).json({ message: 'OK' });
}
