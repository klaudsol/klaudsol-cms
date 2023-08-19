import { withSession } from "@klaudsol/commons/lib/Session";
import RecordNotFound from "@klaudsol/commons/errors/RecordNotFound";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { createHash } from "@/lib/Hash";
import { readContents } from '@/lib/Constants';
import Entity from "@/backend/models/dynamodb/Entity";
import { 
    formatAttributesData, 
    formatEntityTypeSlugResponse, 
    getEntityVariant, 
} from "@/utils/dynamodb/formatResponse";

export default withSession(handleRequests({ get }));

async function get(req, res) {
    await assertUserCan(readContents, req);

    const { entity_type_slug, order } = req.query;

    const rawData = await Entity.whereEntityTypeSlug({ entity_type_slug, order });
    const rawEntityType = await Entity.whereEntityType({ entity_type_slug });
    if (rawEntityType.Items.length === 0) throw new RecordNotFound();
    if (rawData.Items.length === 0) throw new RecordNotFound();

    const entity_type_id = rawEntityType.Items[0].id.S;
    const attributeMetadata = formatAttributesData(rawEntityType.Items);
    const data = formatEntityTypeSlugResponse(rawData, attributeMetadata);

    const metadata = {
        attributes: attributeMetadata,
        entity_type_id: entity_type_id,
        total_rows: rawData.Count,
        variant: getEntityVariant(rawEntityType),
    };

    const output = {
        data: data,
        metadata: metadata,
    };

    output.metadata.hash = createHash(output);

    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}