import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { handleRequests } from '@klaudsol/commons/lib/API';
import { OK, UNPROCESSABLE_ENTITY } from '@klaudsol/commons/lib/HttpStatuses';
import Session from '@klaudsol/commons/models/Session';
import People from '@klaudsol/commons/models/People';
import RecordNotFound from '@klaudsol/commons/errors/RecordNotFound';

export default withSession(handleRequests({ put }));

async function put(req, res) { 
 try{
    const { currentPassword, newPassword, confirmNewPassword } = req.body; 

    //these should be captured by the front-end validator, but the backend should detect
    //it as well.
    if (!currentPassword) {
      res.status(UNPROCESSABLE_ENTITY).json({message: 'Please enter your old password.'}); 
      return;
    }

    if (!newPassword) {
      res.status(UNPROCESSABLE_ENTITY).json({message: 'A password is required.'}); 
      return;
    }

    if (newPassword !== confirmNewPassword) {
      res.status(UNPROCESSABLE_ENTITY).json({message: 'The password does not match the confirmation password.'});
      return;
    } 

    const { sessionToken } = req.user;

    const session = await Session.getSession(sessionToken);
    const forcePasswordChange = await People.updatePassword({id: session.people_id, oldPassword: currentPassword, newPassword});

    const { origin } = req.headers;
    const isFromCMS = origin !== process.env.FRONTEND_URL;

    if (isFromCMS) {
        req.session.cache = {
          ...req.session.cache,
          forcePasswordChange,
        };
        await req.session.save();
    }
    
    res.status(OK).json({message: 'Successfully changed your password.'}); 
  }
  catch (error) {
    if (error instanceof RecordNotFound) {
      res.status(422).json({message: "Incorrect password."});
      return;
    } else {
      await defaultErrorHandler(error, req, res);
    }
  }
}
