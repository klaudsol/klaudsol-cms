//TODO: Refactor to /api/app/timetracking/invoices/index.js 

import Invoice from '@backend/models/apps/timetracking/Invoice';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchInvoicesHandler);

async function fetchInvoicesHandler(req, res) { 
    try{
        const { session_token: session } = req.session;
        const data = await Invoice.all({session});
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