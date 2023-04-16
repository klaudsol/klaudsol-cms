import { withSession } from "@klaudsol/commons/lib/Session";
import { defaultErrorHandler } from "@klaudsol/commons/lib/ErrorHandler";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import {
  OK,
  NOT_FOUND,
  NO_CONTENT_FOUND,
  BAD_REQUEST,
} from "@klaudsol/commons/lib/HttpStatuses";
import Setting from "@/backend/models/core/Setting";
import { assert, assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { createHash } from "@/lib/Hash";
import { resolveResource } from "@/components/Util";
import { resourceValueTypes, imageTypes } from "@/components/cmsTypes";
import {
  deleteFilesFromBucket,
  generateS3ParamsForDeletion,
  updateFilesFromBucket,
  generateEntries,
  generateResource,
  addFileToBucket,
} from "@/backend/data_access/S3";
import { TYPES_REGEX } from "@/components/renderers/validation/TypesRegex";
import { readSettings, writeSettings } from "@/lib/Constants";

export default withSession(handleRequests({ get, put, del }));

async function get(req, res) {
  await assertUserCan(readSettings, req);

  const { slug } = req.query;

  const resourceData = await Setting.get({ slug });

  const resolvedResource = resolveResource(resourceData[0]);

  const output = {
    data: resolvedResource,
    metadata: {},
  };

  output.metadata.hash = createHash(output);
  setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

  resourceData.length
    ? res.status(OK).json(output)
    : res.status(NOT_FOUND).json({});
}

async function del(req, res) {
  await assert(
    {
      loggedIn: true,
    },
    req
  );

  (await assertUserCan(readSettings, req)) &&
    (await assertUserCan(writeSettings, req));

  const { slug } = req.query;

  const foundResource = await Setting.get({ slug });

  await Setting.delete({ slug });

  res.status(OK).json({ message: "Successfully deleted the entry" });
}

async function put(req, res) {
  await assert(
    {
      loggedIn: true,
    },
    req
  );

  (await assertUserCan(readSettings, req)) &&
    (await assertUserCan(writeSettings, req));

  const { files, body: bodyRaw } = req;
  const entriesRaw = JSON.parse(JSON.stringify(bodyRaw));

  const { toDeleteRaw, ...body } = entriesRaw;
  const toDelete = toDeleteRaw.split(",");

  let updatedResource;
  if (files.length) {
    const params = generateS3ParamsForDeletion(toDelete);

    await deleteFilesFromBucket(params);
    const resFromS3 = await addFileToBucket(files[0]);
    const entry = generateResource(resFromS3, files[0]);

    updatedResource = await Setting.update(entry); // receives name, key and type
  } else if (body) {
    updatedResource = await Setting.update(body); // receives name, key and type
  } else {
    return res.status(BAD_REQUEST).json({ message: "undefined entry" });
  }

  const resolvedResource = resolveResource(updatedResource[0]);

  const output = {
    data: resolvedResource,
    metadata: {},
  };

  output.metadata.hash = createHash(output);
  setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

  updatedResource.length
    ? res.status(OK).json(output)
    : res.status(NOT_FOUND).json({});
}
