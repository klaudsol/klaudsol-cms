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

import Entity from "@/backend/models/core/Entity";
import EntityType from "@/backend/models/core/EntityType";
import { withSession } from "@klaudsol/commons/lib/Session";
import { defaultErrorHandler } from "@klaudsol/commons/lib/ErrorHandler";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { resolveValue } from "@/components/EntityAttributeValue";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { createHash } from "@/lib/Hash";
import { addFilesToBucket, generateEntries, generatePresignedUrls } from "@/backend/data_access/S3";
import { transformQuery, sortData } from "@/components/Util";
import { assert, assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { filterData } from '@/components/Util';
import { readContents, writeContents } from '@/lib/Constants';

export default withSession(handleRequests({ get, post }));

async function get(req, res) {
    await assertUserCan(readContents, req);

    const {
        entity_type_slug,
        entry,
        page,
        sort: sortValue,
        drafts,
        ...queries
    } = req.query;

    const rawData = await Entity.where(
        { entity_type_slug, entry, page, drafts },
        queries,
    );
    const rawEntityType = await EntityType.find({ slug: entity_type_slug });
    if (rawEntityType.length === 0) return res.status(NOT_FOUND).json({});

    const isSingleType = (rawEntityType[0].entity_type_variant === 'singleton');

    const initialFormat = {
        indexedData: {},
    };

    const dataTemp = rawData.data.reduce((collection, item) => {
        return {
            indexedData: {
                ...collection.indexedData,
                [item.id]: {
                    ...collection.indexedData[item.id],
                    ...(!collection.indexedData[item.id]?.id && { id: item.id }),
                    ...(!collection.indexedData[item.id]?.slug && {
                        slug: item.entities_slug,
                    }),
                    ...(!collection.indexedData[item.id]?.status && {
                        status: item.entities_status,
                    }),
                    ...({
                        [item.attributes_name]: resolveValue(item) ?? null,
                    }),
                },
            },
        };
    }, initialFormat);

    const initialMetadata = {
        attributes: {},
    };

    const metadata = rawEntityType.reduce((collection, item) => {
        return {
            attributes: {
                ...collection.attributes,
                ...(!collection.attributes[item.attribute_name] &&
                    item.attribute_name && {
                    [item.attribute_name]: {
                        type: item.attribute_type,
                        order: item.attribute_order,
                        ...(item?.attribute_custom_name && { custom_name: item.attribute_custom_name })
                    },
                }),
            },
            entity_type_id: item.entity_type_id,
            variant: item.entity_type_variant,
            total_rows: rawData.total_rows,
        };
    }, initialMetadata);

    let data;
    if (sortValue) data = sortData(dataTemp.indexedData, sortValue);

    const output = {
        data: isSingleType ? Object.values(dataTemp.indexedData)[0] : data ? { ...data } : dataTemp.indexedData,
        metadata: metadata,
    };

    output.metadata.hash = createHash(output);

    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function post(req, res) {
    await assertUserCan(writeContents, req);

    const { fileNames = [], ...entry } = req.body;
    await Entity.create(entry);

    const presignedUrls = fileNames.length > 0 && await generatePresignedUrls(fileNames);

    res.status(OK).json({ message: 'Successfully created a new entry', presignedUrls })
}
