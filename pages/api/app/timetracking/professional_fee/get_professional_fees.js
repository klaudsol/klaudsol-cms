import ProfessionalFee from '@backend/models/apps/timetracking/ProfessionalFee';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default withSession(fetchProfessionalFees);

async function fetchProfessionalFees(req, res) { 
    try{
        const { session_token } = req.session;
        const data = (await ProfessionalFee.all(session_token)) ??  [];
        if(data == null){
          res.status(NOT_FOUND).json([]);
        } else {
          res.status(OK).json(data);
        }
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
} 