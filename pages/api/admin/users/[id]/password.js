import { handleRequests } from "@klaudsol/commons/lib/API";
import { withSession } from "@klaudsol/commons/lib/Session";
import { OK } from '@klaudsol/commons/lib/HttpStatuses';
import InsufficientDataError from '@klaudsol/commons/errors/InsufficientDataError';
import People from '@klaudsol/commons/models/People';

export default withSession(handleRequests({ put }));

async function put(req, res) {
    const { id } = req.query;
    const { oldPassword, password, confirmPassword, forcePasswordChange } = req.body;

    if (!password) throw new InsufficientDataError('Please enter your first password.');
    if (!confirmPassword) throw new InsufficientDataError('Please confirm your password.');
    if (password !== confirmPassword) throw new InsufficientDataError('The passwords do not match.');

    await People.updatePassword({ id, oldPassword, newPassword: password, forcePasswordChange });

    res.status(OK).json({ message: 'Signup successful!' });
}
