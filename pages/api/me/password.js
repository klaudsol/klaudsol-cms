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

import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assert } from '@/lib/Permissions';
import { OK, UNPROCESSABLE_ENTITY } from '@/lib/HttpStatuses';
import Session from '@/backend/models/core/Session';
import People from '@/backend/models/core/People';
import RecordNotFound from 'components/errors/RecordNotFound';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "PUT":
        return update(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function update(req, res) { 
  try{

    await assert({
     loggedIn: true,
    }, req);

    const { session_token } = req.session;
    const { current_password, password, confirmation_password } = req.body; 

    //these should be captured by the front-end validator, but the backend should detect
    //it as well.
    if (!password) {
      res.status(UNPROCESSABLE_ENTITY).json({message: 'A password is required.'}); 
      return;
    }

    if (password !== confirmation_password) {
      res.status(UNPROCESSABLE_ENTITY).json({message: 'The password does not match the confirmation password.'});
      return;
    } 




    const session = await Session.getSession(session_token);
    await People.updatePassword({id: session.people_id, oldPassword: current_password, newPassword: password});

    res.status(OK).json({message: 'Successfully changed your password.'}); 
  }
  catch (error) {
    if (error instanceof RecordNotFound) {
      res.status(422).json({message: "Incorrect password."});
      return;
    } else {
      await defaultErrorHandler(error, req, res);
    }
  }
}