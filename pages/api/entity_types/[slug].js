/**
 * MIT License

Copyright (c) 2022 KlaudSol Philippines, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/

import EntityType from "@/backend/models/core/EntityType";
import { withSession } from "@klaudsol/commons/lib/Session";
import { defaultErrorHandler } from "@klaudsol/commons/lib/ErrorHandler";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { createHash } from "@/lib/Hash";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { assert, assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { writeContents, readContentTypes, writeContentTypes } from '@/lib/Constants';

export default withSession(handleRequests({ get, del, put }));

async function get(req, res) {
  await assertUserCan(readContentTypes, req);

  const { slug } = req.query;

  const entityTypes = await EntityType.all();
  const rawEntityType = await EntityType.whereSlug({ slug });

  const data = rawEntityType.reduce((collection, item) => {
    return {
      ...collection,
      ...(!collection[item.attribute_name] &&
        item.attribute_name && {
          [item.attribute_name]: {
            name: item.attribute_name,
            type: item.attribute_type,
            order: item.attribute_order,
            attribute_id: item.attribute_id,
            ...(item?.attribute_custom_name && { custom_name: item.attribute_custom_name })
          },
        }),
    };
  }, {});

  const output = {
    data,
    metadata: {},
  };

  output.metadata.hash = createHash(output);

  setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });
  entityTypes
    ? res.status(OK).json(output ?? [])
    : res.status(NOT_FOUND).json({});
}

async function del(req, res) {
  await assert(
    {
      loggedIn: true,
    },
    req
  );

  (await assertUserCan(readContentTypes, req)) &&
    (await assertUserCan(writeContentTypes, req));

  const { slug } = req.query;
  await EntityType.delete({ slug });
  res.status(OK).json({ message: "Successfully delete the entity type" });
}

async function put(req, res) {
  await assert(
    {
      loggedIn: true,
    },
    req
  );

  (await assertUserCan(readContentTypes, req)) &&
    (await assertUserCan(writeContentTypes, req));

  const { slug: oldSlug } = req.query;
  const { name, slug: newSlug } = req.body;

  await EntityType.update({ name, newSlug, oldSlug });

  const output = {
    data: { name, newSlug },
    metadata: {},
  };

  output.metadata.hash = createHash(output);

  setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

  res.status(OK).json(output ?? []);
}
