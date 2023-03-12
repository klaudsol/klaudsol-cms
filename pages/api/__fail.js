import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assertUserIsLoggedIn } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    assertUserIsLoggedIn(req);
    
    //force error, let's see what's going to happen!
    throw new Error("I invented this error.");
    
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
      
}
