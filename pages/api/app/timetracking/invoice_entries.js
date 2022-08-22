import InvoiceEntry from '@backend/models/apps/timetracking/InvoiceEntry';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assert } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    
    switch(req.method) {
      case "GET":
        return index(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
        
    }
  
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function index(req, res) { 
    try{
      
        await assert({
          loggedIn: true,
          appsEnabled: ["timetracking"],
          userHasPermission: ["manage"]
        }, req);  
        
        const { session_token: session } = req.session;
        const { invoice_number = null, sme_people_id = null } = req.query
        const data = await InvoiceEntry.where({session, invoice_number, sme_people_id});
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