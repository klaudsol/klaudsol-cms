import { withSession } from '@/lib/Session';
import People from '@backend/models/core/People';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assertUserIsLoggedIn } from '@/lib/Permissions';

export default withSession(logoutHandler);

async function logoutHandler(req, res) {
  try {
    const session_token = assertUserIsLoggedIn(req);
    await People.logout(session_token); 
    req.session.destroy();
    res.status(200).json({message: 'OK'});
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}