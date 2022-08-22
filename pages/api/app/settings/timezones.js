import Timezones from '@backend/models/core/Timezones';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK } from '@/lib/HttpStatuses';

export default withSession(fetchTimezonesHandler);

async function fetchTimezonesHandler(req, res) {
  try{
      switch(req.method) {
        case "GET":
          return displayTimezones(req, res);
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
  }
  catch (error) {
    await defaultErrorHandler(error, req, res);
  }
  async function displayTimezones(req, res) {
    try{
       
      const data = await Timezones.displayTimezones();
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
}