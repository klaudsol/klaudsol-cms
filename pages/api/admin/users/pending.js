import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { OK } from '@klaudsol/commons/lib/HttpStatuses';
import People from '@klaudsol/commons/models/People';
import PeopleGroups from '@klaudsol/commons/models/PeopleGroups';
import { approveUsers, rejectUsers } from "@/lib/Constants";

export default withSession(handleRequests({ post, del }));

async function post(req, res) {
    assertUserCan(approveUsers);

    const { id } = req.body;

    await People.approve({ id });

    res.status(OK).json({ message: 'User approved.' });
}

async function del (req, res) {
    assertUserCan(rejectUsers);

    const { id } = req.query;

    await People.delete({ id });
    await PeopleGroups.delete({ id });

    res.status(OK).json({ message: 'User rejected.' });
}
