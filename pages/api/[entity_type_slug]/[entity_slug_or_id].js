import Entity from '@backend/models/Entity';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assert } from '@/lib/Permissions';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    
    switch(req.method) {
      case "GET":
        return get(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
        
    }
  
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function get(req, res) { 
    try{
      
    /*
        await assert({
          loggedIn: true,
          appsEnabled: ["timetracking"],
          userHasPermission: ["manage"]
        }, req);  
    */
        const session = null;
        
        const { entity_type_slug, entity_slug_or_id } = req.query;
        //const { session_token: session } = req.session;
        const data = await Entity.find({session, entity_type_slug, entity_slug: entity_slug_or_id});
        res.status(OK).json(data);
        //if(data == null){
        //  res.status(NOT_FOUND).json({});
        //} else {
        //  res.status(OK).json({
        //    entity_type_slug, entity_slug_or_id      
        //  });
        //}
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
}