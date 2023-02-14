import { withSession } from "@/lib/Session";
import { defaultErrorHandler } from "@/lib/ErrorHandler";
import { setCORSHeaders, parseFormData } from "@/lib/API";
import {
  OK,
  NOT_FOUND,
  NO_CONTENT_FOUND,
  BAD_REQUEST,
} from "@/lib/HttpStatuses";
import Resource from "@/backend/models/core/Resource";
import { assert } from "@/lib/Permissions";
import { createHash } from "@/lib/Hash";
import { resolveResource } from "@/components/Util";
import { resourceValueTypes, imageTypes } from "@/components/cmsTypes";
import {
  deleteFilesFromBucket,
  generateS3ParamsForDeletion,
  updateFilesFromBucket,
  generateEntries,
  generateResource,
  addFileToBucket
} from "@/backend/data_access/S3";

export default withSession(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return get(req, res);
      case "PUT":
        const { req: parsedReq, res: parsedRes } = await parseFormData(
          req,
          res
        );
        return update(parsedReq, parsedRes);
      case "DELETE":
        return del(req, res);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function get(req, res) {
  try {
    const { slug } = req.query;

    const resourceData = await Resource.get({ slug });

    let resolvedData;

    if (resourceData.length) {
      const data = Object.entries(resourceData[0]).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[!resourceValueTypes.includes(key) ? key : "value"] = value;
          }
          return acc;
        },
        {}
      );

      resolvedData = resolveResource(data);
    }

    const output = {
      data: resolvedData ?? [],
      metadata: {},
    };

    output.metadata.hash = createHash(output);
    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    resourceData.length
      ? res.status(OK).json(output?.data ? output : {})
      : res.status(NOT_FOUND).json({});
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function del(req, res) {
  try {
    await assert(
      {
        loggedIn: true,
      },
      req
    );

    const { slug } = req.query;
    
    const foundResource = await Resource.get({ slug });
    const imageNames = foundResource.flatMap((item) =>
      imageTypes.includes(item.type) ? item.value_string : []
    );

    if (imageNames.length > 0) {
      const params = generateS3ParamsForDeletion(imageNames);
      await deleteFilesFromBucket(params);
    }

    await Resource.delete({ slug });

    res.status(OK).json({ message: "Successfully deleted the entry" });
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function update (req,res) {
  try {
    await assert({
        loggedIn: true,
    }, req);

    const { slug } = req.query;
    const { files, body: bodyRaw } = req;
    const  entriesRaw  = JSON.parse(
      JSON.stringify(bodyRaw)
    );

    const { toDeleteRaw, ...body } = entriesRaw;
    const toDelete = toDeleteRaw.split(",");
      
    if (files.length) {
      const params = generateS3ParamsForDeletion(toDelete);

      await deleteFilesFromBucket(params);
      const resFromS3 = await addFileToBucket(files[0]);
      const entry = generateResource(resFromS3, files[0]);
      
      await Resource.update(entry) // receives name, key and type 
    }
    else if(body) {
      await Resource.update(body) // receives name, key and type 
    }
    else{
      return res.status(BAD_REQUEST).json({message:'undefined entry'})
    }
   
  const updatedResources = await Resource.get({ slug });
    
  let resolvedData;

    if(updatedResources.length){
      const data = Object.entries(updatedResources[0]).reduce((acc, [key, value]) => {
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

    updatedResources.length > 0
      ? res.status(OK).json(output.data ? output : {})
      : res.status(NOT_FOUND).json({});
} catch (error) {
  await defaultErrorHandler(error, req, res);
}
}
