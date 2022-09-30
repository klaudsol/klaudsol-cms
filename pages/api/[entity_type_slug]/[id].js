import Entity from '@backend/models/core/Entity';
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { OK, NOT_FOUND } from '@/lib/HttpStatuses';

export default withSession(handler);

async function handler(req, res) {
  
  try {
    switch(req.method) {
      case "GET":
        return get(req, res); 
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
}

  async function get(req, res) { 
    try{
      const { entity_type_slug, id } = req.query;
      
      const rawData = await Entity.find({entity_type_slug, id});
      
      const initialFormat = {
        data: {}, 
        metadata: {
          attributes: {}  
        }
      };
      
      const resolveValue = (item) => {
        switch(item.attributes_type) {
          case 'text':
            return item.value_string;
          case 'textarea':
            return item.value_long_string;
          case 'float':
            //TODO: Find a more accurate representation of float
            return Number(item.value_double);
        }
      }
      
      //Priority is the first entry in the collection, to make the 
      //system more stable. Suceeding entries that are inconsistent are discarded.
      const data = rawData.reduce((collection, item) => {
        return {
          data: {
            ...collection.data,  
            ...!collection.data.id && {id: item.id},
            ...!collection.data.slug && {slug: item.entities_slug},
            ...!collection.data[item.attributes_name] && {[item.attributes_name]: resolveValue(item)},
          },
          metadata: {
            ...collection.metadata,
            ...!collection.metadata.type && {type: item.entity_type_slug},
            attributes: {
              ...collection.metadata.attributes,
              ...!collection.metadata.attributes[item.attributes_name] && {[item.attributes_name] : {
                type: item.attributes_type,
                order: item.row_id
              }}
            }
          },
        }  
      }, initialFormat);
      
      data ? res.status(OK).json(data ?? []) : res.status(NOT_FOUND).json({})
    }
    catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }