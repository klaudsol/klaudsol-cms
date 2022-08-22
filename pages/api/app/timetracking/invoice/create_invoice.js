import Invoice from '@backend/models/apps/timetracking/Invoice';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';

export default withSession(onCreateHandler);

//TODO: Refactor this file as invoice.js
//Create will be handled by POST.

async function onCreateHandler(req, res) { 
  const {invoiceNumber = null,
         rate = null,
         total_amount = null,
         coverage_start = null,
         coverage_end = null,
         sent_at = null, 
         due_at = null,
         ids = [],
         client_id
        } = req.body; 
    try{
      const { session_token: session } = req.session;
      await Invoice.create({session, invoiceNumber, rate, total_amount, coverage_start, coverage_end, sent_at, due_at, client_id, ids});
      res.status(200).json({message: 'Invoice created successfully.'});
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}