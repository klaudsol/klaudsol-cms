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
import { assert, assertUserCan } from '@/lib/Permissions';
import { OK } from '@/lib/HttpStatuses';
import Attribute from '@backend/models/core/Attribute';
import {
  deleteFilesFromBucket,
  generateS3ParamsForDeletion,
} from "@/backend/data_access/S3";
import { readContentTypes, writeContentTypes } from '@/lib/Constants';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "DELETE":
        return del(req, res);
      case "PUT":
        return update(req, res);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function del(req, res) {
  try{
    
    await assert({
      loggedIn: true,
     }, req);
     
     await assertUserCan(readContentTypes, req) &&
     await assertUserCan(writeContentTypes, req);
     
     const { slug: typeSlug, name } = req.query;
     const imageNames = await Attribute.deleteWhere({type_slug: typeSlug, name});

     if(imageNames.length) {
      const params = generateS3ParamsForDeletion(imageNames);
      await deleteFilesFromBucket(params);
    }

    res.status(OK).json({message: 'Successfully deleted the attribute.'}) 
  }
  catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function update(req, res) {
  try{
    
    await assert({
      loggedIn: true,
     }, req);

    await assertUserCan(readContentTypes, req) &&
    await assertUserCan(writeContentTypes, req);
    
    const { slug: typeSlug, name } = req.query;
    const { attribute } = req.body;

    await Attribute.updateWhere({type_slug: typeSlug, name, attribute});

    res.status(OK).json({message: 'Successfully updated the attribute.'}) 
  }
  catch (error) {
    await defaultErrorHandler(error, req, res);
  }  
}