import People from '@backend/models/core/People';
import { log } from '@/lib/Logger';
import { withSession } from '@/lib/Session';
import { UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';
import UnauthorizedError from '@/components/errors/UnauthorizedError';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assertUserIsLoggedIn } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    assertUserIsLoggedIn(req);
    
    //force error, let's see what's going to happen!
    throw new Error("I invented this error.");
    
    res.status(200).json({});
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
      
}