import EntityTypes from '@backend/models/core/EntityTypes';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';
import { createHash } from '@/lib/Hash';
import { setCORSHeaders } from '@/lib/API';

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
      const entityTypes = await EntityTypes.all();
      const output = {
        data: entityTypes,
        metadata: {}
      }
      
      output.metadata.hash = createHash(output);
      
      setCORSHeaders({response: res, url: process.env.FRONTEND_URL});
      entityTypes ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({})
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }