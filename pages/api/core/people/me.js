import People from '@backend/models/core/People';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { UNPROCESSABLE_ENTITY } from '@/lib/HttpStatuses';
import RecordNotFound from 'components/errors/RecordNotFound';
import { OK } from '@/lib/HttpStatuses';

export default withSession(fetchPerson);

async function fetchPerson(req, res) {
    const {
        id =null,
        first_name = null,
        last_name = null,
        email = null,
        oldPassword = null,
        newPassword = null,
        sme_timezone_id = null
    } = req.body;
    //Validations for updating the password
    if(oldPassword || newPassword){
      if(!oldPassword){
        res.status(UNPROCESSABLE_ENTITY).json({message: "Incorrect password!"});
        return;
      }
      
      if(!newPassword){
        res.status(UNPROCESSABLE_ENTITY).json({message: "Please Input your password!"});
        return;
      }
    }
    //Fetching User info
    try{
      //Restful API working.
        switch(req.method) {
          case "GET":
            return displayCurrentUser(req, res);
          case "PUT":
            return updateUserInfo(req, res); 
          default:
            throw new Error(`Unsupported method: ${req.method}`);
        }
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }

    async function displayCurrentUser(req, res) {
      try {  
        const { session_token } = req.session;
        const data = await People.displayCurrentUser(session_token);
        if(data == null){
          res.status(OK).json({});
        } else {
          res.status(OK).json(data);
        }
      
      } 
      catch (error) {
        await defaultErrorHandler(error, req, res);
      }
    }
    //Updating user Info
    async function updateUserInfo(req, res) {
        try {  
          const { session_token: session } = req.session;
          await People.updateUserInfo({session, id, first_name, last_name, email, oldPassword, newPassword, sme_timezone_id});
          res.status(OK).json({message: 'Successfully Update User info!'});
        
        } catch (error) {
          if (error instanceof RecordNotFound) {
            res.status(UNPROCESSABLE_ENTITY).json({message: "Incorrect Password!"});
            return;
          } else {
            await defaultErrorHandler(error, req, res);
          }
        }
      }
};


