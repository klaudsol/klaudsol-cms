import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assert } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
    try {
      
      await assert({
        loggedIn: true,
        appsEnabled: ["timetracking"],
        userHasPermission: ["manage"]
      }, req);  
      
      const {client_id=null, timerange=null, peopleId=null, invoiceId=null} = req.query;  
      const { session_token: session } = req.session;
       
      const data = await Timesheet.reports({session, client_id, timerange, peopleId, invoiceId});
      res.status(200).json(data ?? []);
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}