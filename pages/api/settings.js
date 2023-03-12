
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import {
  generateResource,
  addFileToBucket
} 
from "@/backend/data_access/S3";
import { resourceValueTypes } from "@/components/cmsTypes";
import { setCORSHeaders, handleRequests } from '@/lib/API';
import { OK, NOT_FOUND, BAD_REQUEST } from "@/lib/HttpStatuses";
import Setting from '@/backend/models/core/Setting';
import { assert } from '@/lib/Permissions';
import { resolveResource } from "@/components/Util";
import { createHash } from "@/lib/Hash";
import { readSettings, writeSettings } from '@/lib/Constants';
import { assertUserCan } from 'lib/Permissions';

export default withSession(handleRequests({ get, post }));

export const config = {
  api: {
      bodyParser: false,
  },
}

async function get(req, res) { 
  
}

async function post(req, res) { 
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
