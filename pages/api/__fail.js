import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { assertUserIsLoggedIn } from '@klaudsol/commons/lib/Permissions';

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
