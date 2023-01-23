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
import { withSession } from "@/lib/Session";
import { defaultErrorHandler } from "@/lib/ErrorHandler";
import { OK, NOT_FOUND } from "@/lib/HttpStatuses";
import { resolveValue } from "@/components/EntityAttributeValue";
import { setCORSHeaders } from "@/lib/API";
import { createHash } from "@/lib/Hash";
import { assert } from "@/lib/Permissions";

export default withSession(handler);

async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return get(req, res);
      case "PUT":
        return update(req, res);
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
    const { entity_type_slug, id: slug } = req.query;

    const rawData = await Entity.findBySlug({ entity_type_slug, slug });

    // If user typed in the id instead of the slug
    // If slug is equal to one of the IDs, prioritize slug
    if(parseInt(slug) && rawData.length === 0) {
        const item = await Entity.find({entity_type_slug, id: slug});

        if(item.length !== 0) {
            const itemSlug = item[0].entities_slug;
            return res.redirect(`/api/${entity_type_slug}/${itemSlug}`);
        }
    }

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

    const { id } = req.query;
    await Entity.delete({ id });
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

    const {
      entries = null,
      entity_id = null,
      entity_type_id = null,
    } = req.body;
    await Entity.update({ entries, entity_type_id, entity_id });
    res.status(OK).json({ message: "Successfully created a new entry" });
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}
