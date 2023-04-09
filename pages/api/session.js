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

const FRONTEND_URL = process.env.KS_FRONTEND_URL ?? process.env.FRONTEND_URL

async function handler(req, res) {
  setCORSHeaders({ response: res, url: FRONTEND_URL });

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

    const { session_token, user: {firstName, lastName, capabilities, defaultEntityType, forcePasswordChange} } = await People.login(email, password);

    const { origin } = req.headers;

    const isFromCMS = origin !== FRONTEND_URL;
    const canLogInToCMS = capabilities.includes('can_log_in_to_cms');

    if (isFromCMS && !canLogInToCMS) throw new UnauthorizedError();

    // Ideally, the session token should be stored in JWT so that both the client and the CMS 
    // can access it, but removing it from req.session might make the program explode.
    const token = generateToken({ firstName, lastName, email, sessionToken: session_token });
    const response = { message: 'Sucessfully logged in!' };

    if (isFromCMS) {
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

async function logout(req, res) {
    const { origin, host } = req.headers;
    const isFromCMS = origin.endsWith(host);

    let currentSessionToken;
    if (isFromCMS) {
        currentSessionToken = assertUserIsLoggedIn(req);

        req.session.destroy();
    } else {
        const token = authorization.substring(BEARER_LENGTH);
        const { sessionToken } = verifyToken(token);

        currentSessionToken = sessionToken;
    }

    await Session.logout(currentSessionToken); 
    res.status(200).json({message: 'OK'});
}
