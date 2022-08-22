import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(onUpdateHandler);

async function onUpdateHandler(req, res) { 
  const { id=null, 
          client_id=null,
          start_time=null,
          end_time=null,
          duration=null,
          description=null } = req.body; 
    try {
          const { session_token: session } = req.session;
          await Timesheet.onUpdate({session, id, client_id, start_time, end_time, duration, description});
          res.status(200).json({message: 'Record has been updated successfully.'});
    }
    catch (error) {
      if (error instanceof RecordNotFound) {
        res.status(INTERNAL_SERVER_ERROR).json({message: "Error creating time entry."});
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
}