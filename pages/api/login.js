import People from '@backend/models/core/People';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK } from '@/lib/HttpStatuses';
import UnauthorizedError from '@/components/errors/UnauthorizedError';

export default withSession(loginHandler);

async function loginHandler(req, res) {
  
  if (req.method?.toUpperCase() !== 'POST') {
    res.status(405).json({ message: `METHOD ${req.method} not allowed.`  })
    return
  }
  
  const {email=null, password=null} = req.body; 
  
  if (!email || !password) {
    res.status(422).json({message: "Invalid username or password."});
    return;
  }
  
  try {
    const { session_token, user: {firstName, lastName, role, defaultEntityType} } = await People.login(email, password);
    req.session.session_token = session_token;
    req.session.cache = {
      firstName,
      lastName,
      role,
      defaultEntityType,
    }; 
    await req.session.save();    
    res.status(200).json({message: "OK"});
    return;
  
  } catch (error) {
    console.error(error);
    if (error instanceof UnauthorizedError) {
      res.status(422).json({message: "Invalid username or password."});
      return;
    } else {
      await defaultErrorHandler(error, req, res);
    }
  }
      
}