import People from '@klaudsol/commons/models/People';
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { setCORSHeaders } from "@klaudsol/commons/lib/API";
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import Session from '@klaudsol/commons/models/Session';
import { assertUserIsLoggedIn } from '@klaudsol/commons/lib/Permissions';
import EntityType from '@/backend/models/core/EntityType';
import { handleRequests } from '@klaudsol/commons/lib/API';
import { generateToken } from '@klaudsol/commons/lib/JWT';
import { assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { canLogIn, canLogInToCms } from '@/lib/Constants';

const FRONTEND_URL = process.env.KS_FRONTEND_URL ?? process.env.FRONTEND_URL

export default withSession(handleRequests({ post, del }));

async function post (req, res) {
    // When assertUserCan can cater to OR statements, include canLogInToCms
    await assertUserCan(canLogIn, req);

    const {email=null, password=null} = req.body; 
  
    if (!email || !password) {
      res.status(UNPROCESSABLE_ENTITY).json({message: "Please enter your username/password."});   
      return
      }

    const { session_token, user: {firstName, lastName, roles, capabilities, defaultEntityType, forcePasswordChange, userId} } = await People.login(email, password);

    // This helps us decide whether to give out a session token or a JWT token
    const { origin } = req.headers;
    const isFromCMS = origin && (origin !== FRONTEND_URL); // Proxies will have no origin on the headers

    let response = { message: 'Sucessfully logged in!' };
    if (isFromCMS) {
        // I cant use assertUserCan(canLogInToCms) here because 
        // the guests are much more likely to access this route
        const isAuthorized = capabilities.includes(canLogInToCms);
        const errorMessage = "You do not have permission to log in. Please contact your administrator."
        if (!isAuthorized) throw new UnauthorizedError(errorMessage);

        req.session.session_token = session_token;
        req.session.cache = {
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
        const token = generateToken({ firstName, lastName, email, capabilities, sessionToken: session_token, id: userId });
        response.token = token;
    }

    res.status(OK).json(response);
}

async function del (req, res) {
    await assertUserCan(canLogIn, req);

    const session_token = req?.user?.sessionToken ?? assertUserIsLoggedIn(req);

    await Session.logout(session_token); 
    req.session.destroy();

    res.status(200).json({message: 'OK'});
}
