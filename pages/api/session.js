import People from '@backend/models/core/People';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, UNPROCESSABLE_ENTITY } from '@/lib/HttpStatuses';
import UnauthorizedError from '@/components/errors/UnauthorizedError';
import Session from '@backend/models/core/Session';
import { assertUserIsLoggedIn } from '@/lib/Permissions';

export default withSession(handler);


async function handler(req, res) {
  try {
    switch(req.method) {
      case "POST":
        return login(req, res);
      case "DELETE":
        return logout(req, res); 
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
      forcePasswordChange
    };

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
