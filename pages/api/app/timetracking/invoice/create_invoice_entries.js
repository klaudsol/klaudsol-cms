import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(onCreateHandler);

async function onCreateHandler(req, res) { 
  const { client_id = null,
         invoice_number=null } = req.body; 
    try{
        const { session_token: session } = req.session;
        await Timesheet.onCreateInvoiceEntries({session, client_id, invoice_number});
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