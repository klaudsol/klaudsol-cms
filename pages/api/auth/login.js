import People from '@backend/models/core/People';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, UNPROCESSABLE_ENTITY } from '@/lib/HttpStatuses';
import UnauthorizedError from '@/components/errors/UnauthorizedError';

export default withSession(loginHandler);

async function loginHandler(req, res) {
  
  if (req.method?.toUpperCase() !== 'POST') {
    res.status(405).json({ message: `METHOD ${req.method} not allowed.`  })
    return
  }
  
  const {email=null, password=null} = req.body; 
  
  if (!email || !password) {
    res.status(UNPROCESSABLE_ENTITY).json({message: "Please enter your username/password."});   
    return
    }
  
  try {
    const { session_token, user: {firstName, lastName, role, defaultEntityType, forcePasswordChange} } = await People.login(email, password);
    req.session.session_token = session_token;
    req.session.cache = {
      firstName,
      lastName,
      role,
      defaultEntityType,
      homepage: '/admin',
      forcePasswordChange
    };
    await req.session.save();    
    res.status(OK).json({ forcePasswordChange });
    return;
  
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(UNPROCESSABLE_ENTITY).json({message: "Invalid username or password."});
      return;
    } else {
      await defaultErrorHandler(error, req, res);
    }
  }
      
}
