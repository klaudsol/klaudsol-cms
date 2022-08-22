import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(onCreateHandler);

async function onCreateHandler(req, res) { 
  const { peopleId = null,
          clientId = null,
          paymentNumber=null } = req.body; 
    try{
        const { session_token: session } = req.session;
        await Timesheet.onCreateProfessionalFeeEntries({session, peopleId, clientId, paymentNumber});
        res.status(200).json({message: 'Invoice has been recorded successfully.'});
    }
    catch (error) {
      if (error instanceof RecordNotFound) {
        res.status(INTERNAL_SERVER_ERROR).json({message: "Error creating invoice entry."});
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
}