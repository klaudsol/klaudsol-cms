import People from '@klaudsol/commons/models/People';
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { setCORSHeaders } from "@klaudsol/commons/lib/API";
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import Session from '@klaudsol/commons/models/Session';
import { assertUserIsLoggedIn } from '@klaudsol/commons/lib/Permissions';
import { generateToken, verifyToken } from '@klaudsol/commons/lib/JWT';
import { canLogInToCms, isApproved } from '@/lib/Constants';

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

    const token = generateToken({ firstName, lastName, email, capabilities, sessionToken: session_token });
    const response = { message: 'Sucessfully logged in!' };

    const { origin } = req.headers;
    const isFromCMS = origin !== FRONTEND_URL;

    if (isFromCMS) {
        const isAuthorized = capabilities.includes(canLogInToCms);
        if (!isAuthorized) throw new UnauthorizedError();

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
        const isAuthorized = capabilities.includes(isApproved);
        if (!isAuthorized) throw new UnauthorizedError();

        response.token = token;
    }

    res.status(OK).json(response);
}

async function logout(req, res) {
    const { origin, authorization } = req.headers;
    const isFromCMS = origin !== process.env.FRONTEND_URL;

    let currentSessionToken;
    if (isFromCMS) {
        currentSessionToken = assertUserIsLoggedIn(req);

        req.session.destroy();
    } else {
        const bearerLength = 7;
        const token = authorization.substring(bearerLength);
        const { sessionToken } = verifyToken(token);

        currentSessionToken = sessionToken;
    }

    await Session.logout(currentSessionToken); 
    res.status(200).json({message: 'OK'});
}
