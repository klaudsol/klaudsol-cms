import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(onCreateHandler);

async function onCreateHandler(req, res) { 
  const {invoice_number = null,
         label = null,
         man_hours = null,
         description = null,
        } = req.body; 
    try{
      const { session_token: session } = req.session;
        Timesheet.onCreateInvoiceAdjustments({session, invoice_number, label, man_hours, description});
        res.status(200).json({message: 'Start time has been recorded successfully.'});
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