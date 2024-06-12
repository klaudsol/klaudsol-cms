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

import Entity from "@/backend/models/core/Entity";
import { withSession } from "@klaudsol/commons/lib/Session";
import { OK } from "@klaudsol/commons/lib/HttpStatuses";
import { handleRequests } from "@klaudsol/commons/lib/API";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { importCSV } from '@/lib/Constants';

export default withSession(handleRequests({ post }));
async function post(req, res) {
  await assertUserCan(importCSV, req);
  const entry = req.body;
  await Entity.batchUpload(entry);

  res.status(OK).json({ message: 'Successfully imported CSV file' })
}
