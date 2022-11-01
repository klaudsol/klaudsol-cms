import Entity from '@backend/models/core/Entity';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';
import { resolveValue } from '@/components/EntityAttributeValue';
import { setCORSHeaders } from '@/lib/API';
import { createHash } from '@/lib/Hash';

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
      
      const initialFormat = {

        indexedData: {},
        metadata: {
          attributes: {}  
        },
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
          metadata: {
            ...collection.metadata,
            ...!collection.metadata.type && {type: item.entity_type_slug},
            ...!collection.metadata.id && {entity_type_id: item.entity_type_id},  
            attributes: {
              ...collection.metadata.attributes,
              ...!collection.metadata.attributes[item.attributes_name] && {[item.attributes_name] : {
                type: item.attributes_type,
                order: item.attributes_order
              }}
            }
          }
        }
        
      }, initialFormat);
      
      const output = {
        data: Object.values(dataTemp.indexedData), 
        metadata: dataTemp.metadata
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
      const { entries = null, columns = null, slug = null, entity_type_id = null } = req.body;
      await Entity.create({entries, columns, slug, entity_type_id});
      res.status(OK).json({message: 'Successfully created a new entry'}) 
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }
