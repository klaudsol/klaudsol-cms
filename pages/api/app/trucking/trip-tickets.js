import { withSession } from '@/lib/Session';
import { UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';
import TripTicket from '@backend/models/apps/trucking/TripTicket';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assert, getSessionToken} from '@/lib/Permissions';

export default withSession(tripTicketHandler);

async function tripTicketHandler(req, res) {
  
  try {
    
    switch(req.method) {
      case "GET":
        return listTripTicketHandler(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
        
    }
  
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
  
};

async function listTripTicketHandler(req, res) {
  
  try {
    
    await assert({
      loggedIn: true,
      appsEnabled: ["trucking"],
      userHasPermission: ["manage"]
    }, req);   
   
    const sessionToken = getSessionToken(req);
    const results = await TripTicket.whereSession(sessionToken);
    
    res.status(OK).json({ results });
  
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
  
}