import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(handler);

async function handler(req, res) { 
  const { start_time=null,
          end_time=null,
          duration=null,
          client_id=null,
          description=null } = req.body; 
    try {
          const { session_token: session } = req.session;
          await Timesheet.onCreate({session, start_time, end_time, duration, client_id, description});
          res.status(200).json({message: 'Record has been created successfully.'});
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}