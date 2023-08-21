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

/** FOR REFERENCE, this is the old entity_type_slug/id file */

import Entity from "@/backend/models/core/Entity";
import {
  deleteFilesFromBucket,
  generatePresignedUrls,
} from "@/backend/data_access/S3";
import { withSession } from "@klaudsol/commons/lib/Session";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { resolveValue } from "@/components/EntityAttributeValue";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { createHash } from "@/lib/Hash";
import { assert, assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { readContents, writeContents } from "@/lib/Constants";
import RecordNotFound from '@klaudsol/commons/errors/RecordNotFound';

export default withSession(handleRequests({ get, del, put }));

async function get(req, res) {
    await assertUserCan(readContents, req);

    const { entity_type_slug, id: slug, drafts } = req.query;
    const rawData = await Entity.findBySlugOrId({ entity_type_slug, slug });
    if (rawData.length === 0) return res.status(NOT_FOUND).json({});

    const initialFormat = {
        data: {},
        metadata: {
            attributes: {},
        },
    };

    if (drafts !== "true" && rawData[0].status === 'draft') {
       throw new RecordNotFound();
    }

    //Priority is the first entry in the collection, to make the
    //system more stable. Suceeding entries that are inconsistent are discarded.
    const output = rawData.reduce((collection, item) => {
        return {
            data: {
                ...collection.data,
                ...(!collection.data.id && { id: item.id }),
                ...(!collection.data.slug && { slug: item.slug }),
                ...(!collection.data.status && { status: item.status }),
                ...({
                    [item.attributes_name]: resolveValue(item) ?? null
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
                            ...(item?.attributes_custom_name && { custom_name: item.attributes_custom_name })
                        },
                    }),
                },
            },
        };
    }, initialFormat);

    output.metadata.hash = createHash(output);
    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });
    rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function del(req, res) {
    await assert(
        {
            loggedIn: true,
        },
        req
    );

    (await assertUserCan(readContents, req)) &&
      (await assertUserCan(writeContents, req));

    const { entity_type_slug, id: slug } = req.query;
    const entity = await Entity.findBySlugOrId({ entity_type_slug, slug });
    const imageNames = entity.flatMap((item) =>
        item.attributes_type === "image" && item.value_string ? item.value_string : []
    );

    if (imageNames.length > 0) await deleteFilesFromBucket(imageNames);
    await Entity.delete({ id: slug });

    res.status(OK).json({ message: "Successfully deleted the entry" });
}

async function put(req, res) {
    await assert(
        {
            loggedIn: true,
        },
        req
    );

    (await assertUserCan(readContents, req)) &&
      (await assertUserCan(writeContents, req));

    const { entity_type_slug, id: entity_id } = req.query;
    const { fileNames, slug, status, ...entries } = req.body;

    await Entity.update({ slug, status, entries, entity_type_slug, entity_id });

    const presignedUrls = fileNames.length > 0 && await generatePresignedUrls(fileNames);

    res.status(OK).json({ message: "Successfully updated the entry.", presignedUrls });
}
