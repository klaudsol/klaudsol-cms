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
import Entity from '@backend/models/core/Entity';
import EntityType from '@backend/models/core/EntityType';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';
import { resolveValue } from '@/components/EntityAttributeValue';
import { setCORSHeaders } from '@/lib/API';
import { createHash } from '@/lib/Hash';
import { assert } from '@/lib/Permissions';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "GET":
        return get(req, res); 
      case "POST":
        return create(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

  async function get(req, res) { 
    try{
      const { entity_type_slug } = req.query;
      const rawData = await Entity.where({entity_type_slug});
      const rawEntityType = await EntityType.find({slug: entity_type_slug});

      const initialFormat = {
        indexedData: {}
      };      
      
      const dataTemp = rawData.reduce((collection, item) => {
        
        return {
          indexedData: {
            ...collection.indexedData,
            [item.id] : {
              ...collection.indexedData[item.id],  
              ...!collection.indexedData[item.id]?.id && {id: item.id}, 
              ...!collection.indexedData[item.id]?.slug && {slug: item.entities_slug},
              ...!collection.indexedData[item.id]?.[item.attributes_name] && {[item.attributes_name]: resolveValue(item)},
            }
          },
        }
        
      }, initialFormat);

      const initialMetadata = {
        attributes: {}
      };

      const metadata = rawEntityType.reduce((collection, item) => {

        return {

          attributes: {
            ...collection.attributes,
            ...!collection.attributes[item.attribute_name] && item.attribute_name && {[item.attribute_name] : {
              type: item.attribute_type,
              order: item.attribute_order
            }}

          },
          entity_type_id: item.entity_type_id

        };

      }, initialMetadata);

      const output = {
        data: Object.values(dataTemp.indexedData), 
        metadata: metadata
      }; 

      output.metadata.hash = createHash(output);

      setCORSHeaders({response: res, url: process.env.FRONTEND_URL});
      
      rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({})
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }

  async function create(req, res) { 
    try{

      await assert({
        loggedIn: true,
       }, req);

      const { entry } = req.body;
      await Entity.create(entry);
      res.status(OK).json({message: 'Successfully created a new entry'}) 
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }
