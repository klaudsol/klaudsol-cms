import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { assertUserCan } from "@klaudsol/commons/lib/Permissions";
import { changeUserPassword } from "@/lib/Constants";
import { OK } from '@klaudsol/commons/lib/HttpStatuses';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import People from '@klaudsol/commons/models/People';

export default withSession(handleRequests({ put }));

async function put(req, res) {
    await assertUserCan(changeUserPassword, req);

    const { id } = req.query;
    const { password, confirmPassword, forcePasswordChange } = req.body;

    if (!password) throw new InsufficientDataError('Please enter your first password.');
    if (!confirmPassword) throw new InsufficientDataError('Please confirm your password.');
    if (password !== confirmPassword) throw new InsufficientDataError('The passwords do not match.');

    await People.resetPassword({ id, newPassword: password, forcePasswordChange });

    res.status(OK).json({ message: 'You have successfully changed your password!' });
}
