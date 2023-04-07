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

import { withSession } from '@klaudsol/commons/lib/Session';
import { handleRequests } from '@klaudsol/commons/lib/API';
import { OK } from '@klaudsol/commons/lib/HttpStatuses';
import Session from '@klaudsol/commons/models/Session';
import People from '@klaudsol/commons/models/People';
import UnauthorizedError from '@klaudsol/commons/errors/UnauthorizedError';
import UnableToUpdateError from '@klaudsol/commons/errors/UnableToUpdateError';
import { verifyToken } from '@klaudsol/commons/lib/JWT';
import { setCookie, getCookie } from 'cookies-next';

export default withSession(handleRequests({ put }));

async function put(req, res) {
    const cookie = getCookie('token', { req, res });
    if (!cookie) throw new UnauthorizedError();

    const { sessionToken } = verifyToken(cookie);

    const { firstName, lastName, email } = req.body;
    if (!firstName) throw new UnableToUpdateError({ message: 'Please enter your first name.'});
    if (!lastName) throw new UnableToUpdateError({ message: 'Please enter your last name.'});
    if (!email) throw new UnableToUpdateError({ message: 'Please enter your email.'});

    const session = await Session.getSession(sessionToken);
    await People.updateUserInfo({ id: session.people_id, firstName, lastName, email, });

    const { origin, host } = req.headers;
    const isFromCMS = origin.endsWith(host);

    if (isFromCMS) {
        req.session.cache = {
            ...req.session.cache,
        };
        await req.session.save();
    }

    setCookie('token')

    res.status(OK).json({ message: 'User info updated.' });
}
