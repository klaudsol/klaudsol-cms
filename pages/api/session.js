import People from '@klaudsol/commons/models/People';
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { setCORSHeaders } from "@klaudsol/commons/lib/API";
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import Session from '@klaudsol/commons/models/Session';
import { assertUserIsLoggedIn } from '@klaudsol/commons/lib/Permissions';
import { generateToken, verifyToken } from '@klaudsol/commons/lib/JWT';

export default withSession(handler);

const BEARER_LENGTH = 7;

async function handler(req, res) {
  setCORSHeaders({ response: res, url: process.env.KS_FRONTEND_URL ?? process.env.FRONTEND_URL });

  try {
    switch(req.method) {
      case "POST":
        return await login(req, res);
      case "DELETE":
        return await logout(req, res); 
      case "OPTIONS":
        return res.status(OK).json({});
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(UNPROCESSABLE_ENTITY).json({message: "Invalid username or password."});
      return;
    } else {
      await defaultErrorHandler(error, req, res);
    }
  }
}

async function login (req, res) {   
    const {email=null, password=null} = req.body; 
  
    if (!email || !password) {
      res.status(UNPROCESSABLE_ENTITY).json({message: "Please enter your username/password."});   
      return
      }

    const { session_token, user: {firstName, lastName, roles, capabilities, defaultEntityType, forcePasswordChange} } = await People.login(email, password);

    const { origin, host } = req.headers;

    const isFromCMS = origin.endsWith(host);
    const canLogInToCMS = capabilities.includes('can_log_in_to_cms');

    if (isFromCMS && !canLogInToCMS) throw new UnauthorizedError();

    // If the user logged in from the CMS, the token is stored on the cache (basically just in a cookie).
    // However, if the user is not logged in, the response token is returned.
    const token = generateToken({ firstName, lastName, email, sessionToken: session_token });
    const response = { message: 'Sucessfully logged in!' };

    if (isFromCMS) {
        req.session.session_token = session_token;
        req.session.cache = {
          token,
          firstName,
          lastName,
          roles,
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

async function logout(req, res) {
    const { origin, host, authorization } = req.headers;
    const isFromCMS = origin.endsWith(host);

    let session_token;
    if (isFromCMS) {
        session_token = assertUserIsLoggedIn(req);

        req.session.destroy();
    } else {
        const token = authorization.substring(BEARER_LENGTH);
        const decodedToken = verifyToken(token);

        session_token = decodedToken.sessionToken;
    }

    await Session.logout(session_token); 

    res.status(200).json({message: 'OK'});
}
