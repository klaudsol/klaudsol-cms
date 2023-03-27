
import { withSession } from '@klaudsol/commons/lib/Session';
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import {
  generateResource,
  generatePresignedUrls,
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

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "GET":
        return await get(req, res); 
      case "POST":
        const { req: parsedReq, res: parsedRes } = await parseFormData(req, res);
        return await create(parsedReq, parsedRes);
      case "PUT":
        return update(req, res);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function get(req, res) { 
    await assertUserCan(readSettings, req);

    const settings = await Setting.get();

    // Formats the values for the `main_logo` property since its an image from S3
    const mainLogoIndex = settings.findIndex((item) => item.setting === 'main_logo');
    const mainLogo = settings[mainLogoIndex];
    const mainLogoValue = mainLogo.value;
    mainLogo.value = {
        name: mainLogoValue.substring(mainLogoValue.indexOf('_') + 1),
        key: mainLogoValue,
        link: `${process.env.KS_S3_BASE_URL}/${mainLogoValue}` 
    }
    settings[mainLogoIndex] = mainLogo;

    const output = {
      data: settings,
      metadata: {}
    }
    
    output.metadata.hash = createHash(output);
    
    setCORSHeaders({response: res, url: process.env.FRONTEND_URL});
    settings ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({})
}

// deprecated
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

async function update(req, res) {
    await assert({
        loggedIn: true,
    }, req);

    await assertUserCan(writeSettings, req);

    const { fileNames, toDelete, ...entry } = req.body;
    await Setting.update(entry);

    const presignedUrls = fileNames.length > 0 && await generatePresignedUrls(fileNames);

    res.status(OK).json({ message: 'Successfully updated the settings', presignedUrls }) 
}

