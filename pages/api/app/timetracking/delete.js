import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
export default withSession(deleteRecordHandler);

async function deleteRecordHandler(req, res) { 
   const {id=null} = req.body; 
    try{
        const { session_token } = req.session;
        const isRecordDeleted = await Timesheet.deleteRecord(session_token, id);
        if(isRecordDeleted) {
          res.status(200).json({message: 'Record has been deleted successfully.'});
        } else {
          res.status(400).json({message: 'No session found.'});
        }
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}