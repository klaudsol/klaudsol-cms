//TODO: Refactor to /api/app/timetracking/customers
import Customers from '@backend/models/core/Customers';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchTimesheetHandler);

async function fetchTimesheetHandler(req, res) { 
    try{
        const { session_token: session } = req.session;
        const data = await Customers.all({ session });
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