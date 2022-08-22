import Survey from '@backend/models/apps/survey/SurveyForm';
import { withSession } from '@/lib/Session';
import { log } from '@/lib/Logger';
import { COMMUNICATION_LINKS_FAILURE } from '@/lib/HttpStatuses';

export default withSession(surveyHandler);

async function surveyHandler(req, res) { 
    try{
        const { session_token } = req.session;
        const data_questions = await Survey.displayPresidentialPoll(session_token);
        res.status(200).json(data_questions);
    }
    catch (ex) {
      await log(ex.stack);
      res.status(COMMUNICATION_LINKS_FAILURE).json({message: ex});
    }
}