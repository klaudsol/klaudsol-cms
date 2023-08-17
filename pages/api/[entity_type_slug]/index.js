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

import { withSession } from "@klaudsol/commons/lib/Session";
import RecordNotFound from "@klaudsol/commons/errors/RecordNotFound";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { createHash } from "@/lib/Hash";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { readContents } from '@/lib/Constants';
import Entity from "@/backend/models/dynamo/Entity";
import { formatEntityTypeSlugResponse, getAttributes, getContent, getContentLength, getEntityVariant, getListAttributes } from "@/utils/formatResponse";

export default withSession(handleRequests({ get }));

async function get(req, res) {
    await assertUserCan(readContents, req);

    const { entity_type_slug } = req.query;

    const rawData = await Entity.whereAll({ entity_type_slug });
    if (rawData.Items.length === 0) throw new RecordNotFound();
    const entityIdRaw = rawData.Items[0].PK.S;
    const entity_type_id = entityIdRaw.split('#')[1];

    const dataTemp = getContent(rawData);

    const metadata = {
        attributes: getAttributes(rawData),
        entity_type_id: entity_type_id,
        total_rows: getContentLength(rawData),
        variant: getEntityVariant(rawData),
    };

    const output = {
        data: dataTemp,
        metadata: metadata,
    };

    output.metadata.hash = createHash(output);

    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}