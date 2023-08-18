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
} from "@/utils/dynamodb/formatResponse";
import { DYNAMO_DB_ID_SEPARATOR } from "@/constants";

export default withSession(handleRequests({ get }));

async function get(req, res) {
    await assertUserCan(readContents, req);

    const { entity_type_slug, slug } = req.query;

    const rawData = await Entity.findByEntityTypeSlugAndSlug({ entity_type_slug, slug });
    const rawEntityType = await Entity.whereEntityType({ entity_type_slug });
    if (rawEntityType.Items.length === 0) throw new RecordNotFound();
    if (rawData.Items.length === 0) throw new RecordNotFound();

    const entity_type_id = rawEntityType.Items[0].id.S;
    const attributeMetadata = formatAttributesData(rawEntityType.Items);
    const data = formatEntityTypeSlugResponse(rawData, attributeMetadata);

    const metadata = {
        attributes: attributeMetadata,
        type: entity_type_slug,
        entity_type_id: entity_type_id,
    };

    const output = {
        data: Object.values(data)[0],
        metadata: metadata,
    };

    output.metadata.hash = createHash(output);

    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}