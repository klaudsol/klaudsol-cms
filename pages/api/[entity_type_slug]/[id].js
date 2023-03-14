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

import Entity from "@backend/models/core/Entity";
import {
  deleteFilesFromBucket,
  updateFilesFromBucket,
  generateS3ParamsForDeletion,
  generateEntries,
} from "@/backend/data_access/S3";
import { withSession } from "@klaudsol/commons/lib/Session";
import { defaultErrorHandler } from "@klaudsol/commons/lib/ErrorHandler";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { resolveValue } from "@/components/EntityAttributeValue";
import { setCORSHeaders, parseFormData } from "@klaudsol/commons/lib/API";
import { createHash } from "@/lib/Hash";
import { assert, assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { readContents, writeContents } from '@/lib/Constants';

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
    await assertUserCan(readContents, req);

    const { entity_type_slug, id: slug } = req.query;
    
    const rawData = await Entity.findBySlugOrId({ entity_type_slug, slug });

    const initialFormat = {
      data: {},
      metadata: {
        attributes: {},
      },
    };

    //Priority is the first entry in the collection, to make the
    //system more stable. Suceeding entries that are inconsistent are discarded.
    const output = rawData.reduce((collection, item) => {
      return {
        data: {
          ...collection.data,
          ...(!collection.data.id && { id: item.id }),
          ...(!collection.data.slug && { slug: item.entities_slug }),
          ...(!collection.data[item.attributes_name] && {
            [item.attributes_name]: resolveValue(item),
          }),
        },
        metadata: {
          ...collection.metadata,
          ...(!collection.metadata.type && { type: item.entity_type_slug }),
          ...(!collection.metadata.id && {
            entity_type_id: item.entity_type_id,
          }),
          attributes: {
            ...collection.metadata.attributes,
            ...(!collection.metadata.attributes[item.attributes_name] && {
              [item.attributes_name]: {
                type: item.attributes_type,
                order: item.attributes_order,
              },
            }),
          },
        },
      };
    }, initialFormat);

    output.metadata.hash = createHash(output);
    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });
    rawData
      ? res.status(OK).json(output ?? [])
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

    await assertUserCan(readContents, req) &&
    await assertUserCan(writeContents, req);

    const { entity_type_slug, id: slug } = req.query;
    const entity = await Entity.findBySlugOrId({ entity_type_slug, slug });
    const imageNames = entity.flatMap((item) =>
      item.attributes_type === "image" ? item.value_string : []
    );
    
    console.log(imageNames)
    if (imageNames.length > 0) {
      const params = generateS3ParamsForDeletion(imageNames);
      await deleteFilesFromBucket(params);
    }

    await Entity.delete({ id: slug });

    res.status(OK).json({ message: "Successfully delete the entry" });
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function update(req, res) {
  try {
    await assert(
      {
        loggedIn: true,
      },
      req
    );

    await assertUserCan(readContents, req) &&
    await assertUserCan(writeContents, req);

    const { files, body: bodyRaw } = req;
    const { entity_type_slug, entity_id, ...entriesRaw } = JSON.parse(
      JSON.stringify(bodyRaw)
    );
    const { toDeleteRaw, ...body } = entriesRaw;
    const toDelete = toDeleteRaw ? toDeleteRaw.split(",") : []
    
    if (files.length > 0) {
      const resFromS3 = await updateFilesFromBucket(files, body, toDelete);
      const entries = generateEntries(resFromS3, files, body);

      await Entity.update({ entries, entity_type_slug, entity_id });
      
    } else {
      await Entity.update({ entries: body, entity_type_slug, entity_id });
    }

    res.status(OK).json({ message: "Successfully created a new entry" });
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}
