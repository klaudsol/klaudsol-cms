import EntityType from "@backend/models/core/EntityType";
import { withSession } from "@klaudsol/commons/lib/Session";
import { defaultErrorHandler } from "@klaudsol/commons/lib/ErrorHandler";
import { OK } from "@klaudsol/commons/lib/HttpStatuses";
import { createHash } from "@/lib/Hash";
import { setCORSHeaders } from "@klaudsol/commons/lib/API";
import { assert, assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { readContentTypes, writeContentTypes } from "@/lib/Constants";

export default withSession(handler);

async function handler(req, res) {
  try {
    switch (req.method) {
      case "PUT":
        return await update(req, res);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function update(req, res) {
  await assert(
    {
      loggedIn: true,
    },
    req
  );

  (await assertUserCan(readContentTypes, req)) &&
    (await assertUserCan(writeContentTypes, req));

  const { slug } = req.query;
  const { icon } = JSON.parse(req.body);

  await EntityType.updateIcon({ slug, icon });

  const output = {
    data: { slug, icon },
    metadata: {},
  };

  output.metadata.hash = createHash(output);

  setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

  res.status(OK).json(output ?? []);
}
