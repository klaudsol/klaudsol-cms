import People from '@klaudsol/commons/models/People';
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { setCORSHeaders } from "@klaudsol/commons/lib/API";
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import Session from '@klaudsol/commons/models/Session';
import { assertUserIsLoggedIn } from '@klaudsol/commons/lib/Permissions';
import EntityType from '@/backend/models/core/EntityType';
import { setCookie } from 'cookies-next';
import { generateToken } from '@klaudsol/commons/lib/JWT';

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
    await defaultErrorHandler(error, req, res);
  }
}

async function login (req, res) {   
  try {

    const {email=null, password=null} = req.body; 
  
    if (!email || !password) {
      res.status(UNPROCESSABLE_ENTITY).json({message: "Please enter your username/password."});   
      return
      }

    const { session_token, user: {firstName, lastName, roles, capabilities, defaultEntityType, forcePasswordChange} } = await People.login(email, password);
    req.session.session_token = session_token;
    req.session.cache = {
      firstName,
      lastName,
      roles,
      capabilities,
      defaultEntityType,
      homepage: '/admin',
      forcePasswordChange,
    };

    const token = generateToken({ firstName, lastName });
    setCookie('token', token, { req, res, httpOnly: true, secure: true, sameSite: 'none' });

    await req.session.save();    
    res.status(OK).json({ forcePasswordChange });
  
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(UNPROCESSABLE_ENTITY).json({message: "Invalid username or password."});
      return;
    } else {
      await defaultErrorHandler(error, req, res);
    }
  }
}

async function logout(req, res) {
  try {
    const session_token = assertUserIsLoggedIn(req);
    await Session.logout(session_token); 
    req.session.destroy();
    res.status(200).json({message: 'OK'});
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}
