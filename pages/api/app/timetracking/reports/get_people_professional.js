
import People from '@backend/models/core/People';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchPeopleProfessional);

async function fetchPeopleProfessional(req, res) { 
    try{
        const { session_token } = req.session;
        const data = await People.displayPeopleProfessional(session_token);
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