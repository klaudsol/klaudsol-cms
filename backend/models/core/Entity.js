import DB, { sha256, fieldsForSelect, fromAurora, sanitizeData, AURORA_TYPE } from '@backend/data_access/DB';
import { log } from '@/lib/Logger';
import UnauthorizedError from '@/components/errors/UnauthorizedError';
import Session from '@backend/models/core/Session';
import RecordNotFound from 'components/errors/RecordNotFound';

class Entity {

    static async entityTypes() {
        const db = new DB();
  
        const sql = `SELECT entity_types.id, entity_types.name, entity_types.slug from entity_types`;
         
        const data = await db.exectuteStatement(sql, []);
        
        
        return data.records.map(([
            {longValue: entity_type_id},
            {stringValue: entity_type_name},
            {stringValue: entity_type_slug},
          ]) => ({
            entity_type_id, entity_type_name, entity_type_slug
          })); 
    }

    static async find({entity_type_slug, id}) {
      const db = new DB();

      const sql = `SELECT entities.id, entity_types.name, entity_types.slug, entities.slug, 
                  attributes.name, attributes.type, attributes.\`order\`,
        \`values\`.value_string, 
        \`values\`.value_long_string, 
        \`values\`.value_integer, 
        \`values\`.value_datetime, 
        \`values\`.value_double                       
      FROM entities
      LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
      LEFT JOIN attributes ON attributes.entity_id = entities.id
      LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
      WHERE 
          entity_types.slug = :entity_type_slug AND 
          entities.id = :id
          
      ORDER BY attributes.\`order\` ASC
          `;
                
      const data = await db.exectuteStatement(sql, [
          {name: 'entity_type_slug', value:{stringValue: entity_type_slug}},
          {name: 'id', value:{longValue: id}},
      ]);
      
      return data.records.map(([
          {longValue: id},
          {stringValue: entity_type_name},
          {stringValue: entity_type_slug},
          {stringValue: entities_slug},
          {stringValue: attributes_name},
          {stringValue: attributes_type},
          {longValue: attributes_order},
          {stringValue: value_string},
          {stringValue: value_long_string},
          {longValue: value_integer},
          {stringValue: value_datetime},
          {stringValue: value_double}
        ]) => ({
          id, 
          entity_type_name, 
          entity_type_slug, 
          entities_slug, 
          attributes_name, 
          attributes_type, 
          attributes_order, 
          value_string,
          value_long_string,
          value_integer,
          value_datetime,
          value_double
        })); 
    }

    static async where({entity_type_slug}) {
      const db = new DB();

      const sql = `SELECT entities.id, entity_types.name, entity_types.slug, entities.slug, 
                  attributes.name, attributes.type, attributes.\`order\`,
        \`values\`.value_string, 
        \`values\`.value_long_string, 
        \`values\`.value_integer, 
        \`values\`.value_datetime, 
        \`values\`.value_double                       
      FROM entities
      LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
      LEFT JOIN attributes ON attributes.entity_id = entities.id
      LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
      WHERE 
          entity_types.slug = :entity_type_slug  
      ORDER BY entities.id, attributes.\`order\` ASC
          `;
                
      const data = await db.exectuteStatement(sql, [
          {name: 'entity_type_slug', value:{stringValue: entity_type_slug}},
      ]);
      
      return data.records.map(([
          {longValue: id},
          {stringValue: entity_type_name},
          {stringValue: entity_type_slug},
          {stringValue: entities_slug},
          {stringValue: attributes_name},
          {stringValue: attributes_type},
          {longValue: attributes_order},
          {stringValue: value_string},
          {stringValue: value_long_string},
          {longValue: value_integer},
          {stringValue: value_datetime},
          {stringValue: value_double}
        ]) => ({
          id, 
          entity_type_name, 
          entity_type_slug, 
          entities_slug, 
          attributes_name, 
          attributes_type, 
          attributes_order, 
          value_string,
          value_long_string,
          value_integer,
          value_datetime,
          value_double
        })); 
  }

  static async attributes({entity_type_slug}) {
    const db = new DB();

    const sql = `select entity_types.name, entity_types.id, attributes.name, attributes.type, attributes.order from attributes
    LEFT JOIN entity_types ON entity_types.id = attributes.entity_id
    WHERE 
      entity_types.slug = :entity_type_slug`;
              
    const data = await db.exectuteStatement(sql, [
        {name: 'entity_type_slug', value:{stringValue: entity_type_slug}},
    ]);
    
    return data.records.map(([
        {stringValue: entity_type_name},
        {longValue: entity_type_id},
        {stringValue: attributes_name},
        {stringValue: attributes_type},
        {longValue: attributes_order},
      ]) => ({
        entity_type_name, entity_type_id, attributes_name, attributes_type, attributes_order
      })); 
  }
}

export default Entity;