import People from '@backend/models/core/People';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assert } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
    try {
      
      await assert({
        loggedIn: true,
        userHasPermission: ["manage"]
      }, req);  
      
      const {client_id=null, timerange=null} = req.query;  
      const { session_token: session } = req.session;
       
      const data = await People.all(session);
      res.status(200).json(data ?? []);
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}