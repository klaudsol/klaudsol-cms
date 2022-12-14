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

import EntityType from '@backend/models/core/EntityType';
import Attribute from '@backend/models/core/Attribute';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';
import { createHash } from '@/lib/Hash';
import { setCORSHeaders } from '@/lib/API';
import { assert } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "POST":
        return create(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

async function create(req, res) { 
  try{

    const { slug } = req.query;

    await assert({
      loggedIn: true,
     }, req);

    const { attribute } = req.body;
    console.error(attribute);
    const entityType = await EntityType.findBySlug(slug);
    console.error(entityType);
    await Attribute.create({
      entity_type_id: entityType.entity_type_id,
      name: attribute.name,
      type: attribute.type,
      order: attribute.order
    }); 
    res.status(OK).json({message: 'Successfully created a new attribute.'}) 
  }
  catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}
