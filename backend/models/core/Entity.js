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

  /*
  static async createEntry({entries}) {
    const db = new DB();

    let entryValues = ``;
    entries.map((entry, i) => {
      entryValues += ` ${i > 0 ? ',' : ''}(${entry.entity_id}, ${entry.attribute_id}, ${entry.value_string}, ${entry.value_long_string}, ${entry.value_double}, ${entry.last_row_id})`
    })

    const insertEntrySQL = `insert into \`values\` (entity_id, attribute_id, value_string, value_long_string, value_double, row_id) VALUES ${entryValues}`;
    const data = await db.exectuteStatement(insertEntrySQL, []);
    
    return true;
}*/


  
}

export default Entity;