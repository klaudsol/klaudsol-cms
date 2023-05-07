import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { createHash } from '@/lib/Hash';
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { readGroups } from "@/lib/Constants";
import { OK, NOT_FOUND } from '@klaudsol/commons/lib/HttpStatuses';
import Groups from '@klaudsol/commons/models/Groups';

export default withSession(handleRequests({ get }));

async function get(req, res) {
    await assertUserCan(readGroups, req);

    const groups = await Groups.all();

    const output = {
        data: groups,
        metadata: {},
    };

    output.metadata.hash = createHash(output);

    groups ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}
