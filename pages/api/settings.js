
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import {
  generateResource,
  addFileToBucket
} 
from "@/backend/data_access/S3";
import { resourceValueTypes } from "@/components/cmsTypes";
import { setCORSHeaders, parseFormData } from '@klaudsol/commons/lib/API';
import { OK, NOT_FOUND, BAD_REQUEST } from "@klaudsol/commons/lib/HttpStatuses";
import Setting from '@/backend/models/core/Setting';
import { assert, assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { resolveResource } from "@/components/Util";
import { createHash } from "@/lib/Hash";
import { readSettings, writeSettings } from '@/lib/Constants';

export default withSession(handler);

export const config = {
  api: {
      bodyParser: false,
  },
}

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "GET":
        return await get(req, res); 
      case "POST":
        const { req: parsedReq, res: parsedRes } = await parseFormData(req, res);
        return await create(parsedReq, parsedRes);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function get(req, res) { 
  
}

async function create(req, res) { 
  try {
    await assert({
        loggedIn: true,
    }, req);
    
    await assertUserCan(readSettings, req) &&
    await assertUserCan(writeSettings, req);

    const { files, body } = req;
  
    let createdResource;
    if (files.length) {
      const resFromS3 = await addFileToBucket(files[0]);
      const entry = generateResource(resFromS3, files[0]);   
      
      createdResource = await Setting.create(entry) // receives name, key and type 
    }
    else if(body) {
      createdResource = await Setting.create(body) // receives name, key and type 
    }
    else{
      return res.status(BAD_REQUEST).json({message:'undefined entry'})
    }
   
  let resolvedData;

    if(createdResource.length){
      const data = Object.entries(createdResource[0]).reduce((acc, [key, value]) => {
        if (value) {
          acc[!resourceValueTypes.includes(key) ? key : "value"] = value;
        }
        return acc;
      }, {});
      resolvedData = resolveResource(data);
    }
   
    const output = {
      data: resolvedData ?? [],
      metadata: {},
    };

    output.metadata.hash = createHash(output);
    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    createdResource.length > 0
      ? res.status(OK).json(output.data ? output : [])
      : res.status(NOT_FOUND).json({});
} catch (error) {
  await defaultErrorHandler(error, req, res);
}
  
}
