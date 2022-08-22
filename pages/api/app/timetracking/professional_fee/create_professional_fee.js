import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(onCreateHandler);

async function onCreateHandler(req, res) { 
  const {peopleId = null, 
         paymentNumber = null,
         totalHours = null,
         developerRate = null, 
         grossPay = null, 
         tax = null, 
         netPay = null, 
         averageHours = null} = req.body; 
    try{
        const { session_token: session } = req.session;
        Timesheet.onCreateProfessionalFee({session, peopleId, paymentNumber, totalHours, developerRate, grossPay, tax, netPay, averageHours});
        res.status(200).json({message: 'Professional Fee has been recorded successfully'});
    }
    catch (error) {
      if (error instanceof RecordNotFound) {
        res.status(INTERNAL_SERVER_ERROR).json({message: "Error creating professional fee entry."});
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
}