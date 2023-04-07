import People from '@klaudsol/commons/models/People';
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { setCORSHeaders } from "@klaudsol/commons/lib/API";
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import Session from '@klaudsol/commons/models/Session';
import { assertUserIsLoggedIn } from '@klaudsol/commons/lib/Permissions';
import EntityType from '@/backend/models/core/EntityType';
import { setCookie, deleteCookie } from 'cookies-next';
import { generateToken } from '@klaudsol/commons/lib/JWT';

const COOKIE_NAME = 'token';

export default withSession(handler);

async function handler(req, res) {
  // i hate cors
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

    const cmsUsers = "CMS Users"
    const isCMSUser = roles.includes(cmsUsers);

    if (isFromCMS && !isCMSUser) throw new UnauthorizedError();

    const token = generateToken({ firstName, lastName });
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
    }

    setCookie(COOKIE_NAME, token, { req, res, httpOnly: true, secure: true, sameSite: 'none' });

    res.status(OK).json(response);
}

async function logout(req, res) {
    const { origin, host } = req.headers;
    const isFromCMS = origin.endsWith(host);

    if (isFromCMS) {
        const session_token = assertUserIsLoggedIn(req);
        await Session.logout(session_token); 
        req.session.destroy();
    } 

    deleteCookie(COOKIE_NAME, { req, res });

    res.status(200).json({message: 'OK'});
}
