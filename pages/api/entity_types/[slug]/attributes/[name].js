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
import { defaultErrorHandler } from '@klaudsol/commons/lib/ErrorHandler';
import { assert, assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { handleRequests } from '@klaudsol/commons/lib/API';
import { OK } from '@klaudsol/commons/lib/HttpStatuses';
import Attribute from '@/backend/models/core/Attribute';
import { readContentTypes, writeContentTypes } from '@/lib/Constants';

export default withSession(handleRequests({ del, put }));

async function del(req, res) {
    await assert(
        {
            loggedIn: true,
        },
        req
    );

    (await assertUserCan(readContentTypes, req)) &&
        (await assertUserCan(writeContentTypes, req));

    const { slug: typeSlug, name } = req.query;

    await Attribute.deleteWhere({ type_slug: typeSlug, name });

    res.status(OK).json({ message: "Successfully deleted the attribute." });
}

async function put(req, res) {
    await assert(
        {
            loggedIn: true,
        },
        req
    );

    (await assertUserCan(readContentTypes, req)) &&
        (await assertUserCan(writeContentTypes, req));

    const { slug: typeSlug, name } = req.query;
    const { attribute } = req.body;

    await Attribute.updateWhere({ type_slug: typeSlug, name, attribute });

    res.status(OK).json({message: 'Successfully updated the attribute.'})
}
