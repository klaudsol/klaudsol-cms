import { withSession } from "@klaudsol/commons/lib/Session";
import RecordNotFound from "@klaudsol/commons/errors/RecordNotFound";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { createHash } from "@/lib/Hash";
import { readContents } from '@/lib/Constants';
import Content from "@/backend/models/dynamodb/Content";
import { 
    formatAttributesData, 
    formatEntityTypeSlugResponse, 
} from "@/utils/dynamodb/formatResponse";

export default withSession(handleRequests({ get }));

async function get(req, res) {
    //await assertUserCan(readContents, req);

    const { organization_slug, content_type_slug, slug } = req.query;

    const output = await Content.findByContentTypeSlugAndSlug({ organization_slug, content_type_slug, slug });
    output.metadata.hash = createHash(output);

    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    output ? res.status(OK).json(output ?? {}) : res.status(NOT_FOUND).json({});
}