import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchTimesheetHandler);

async function fetchTimesheetHandler(req, res) {
  const {client_id=null, timerange=null} = req.query;  
    try{
      const { session_token: session } = req.session;
       
        const data = await Timesheet.displayTimesheet({session, client_id, timerange});
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