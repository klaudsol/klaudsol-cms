
import Settings from '@backend/models/core/Settings';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchTenantSettings);

async function fetchTenantSettings(req, res) { 
    try{
        const { session_token } = req.session;
        const data = await Settings.displayTenantSettings(session_token);
        if(data == null){
          res.status(200).json([]);
        } else {
          res.status(200).json(data);
        }
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}