import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';
import Professional from '@/backend/models/core/Professional.js';

export default withSession(handler);

async function handler(req, res) { 
    try{
        const { session_token: session } = req.session;
        const { id } = req.query;
        const data = await Professional.find({session, id});
        if (data) {
            res.status(OK).json(data);
        } else  {
            res.status(NOT_FOUND).json({});
        }
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
} 