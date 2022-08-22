import Timesheet from '@backend/models/apps/timetracking/Timesheet';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchInvoicesHandler);

async function fetchInvoicesHandler(req, res) { 
    try{
        const { session_token } = req.session;
        const {invoice_number:invoiceNumber=null} = req.query;  
        const data = await Timesheet.displayAdjustments(session_token, invoiceNumber);
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