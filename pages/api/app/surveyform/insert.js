import Survey from '@backend/models/apps/survey/SurveyForm';
import { log } from '@/lib/Logger';
import { withSession } from '@/lib/Session';
import { COMMUNICATION_LINKS_FAILURE } from '@/lib/HttpStatuses';

export default withSession(recordSurveyHandler);

async function recordSurveyHandler(req, res) { 
  const {answer =null} = req.body; 
    try{
        const { session_token } = req.session;
        const isSurveyRecorded = await Survey.recordSurvey(answer, session_token);
        if(isSurveyRecorded) {
          res.status(200).json({message: 'Record has been recorded successfully.'});
        } else {
          res.status(400).json({message: 'No session found.'});
        }
    } 
    catch (ex) {
      await log(ex.stack);
      res.status(COMMUNICATION_LINKS_FAILURE).json({message: ex});
    }
}