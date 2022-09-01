import DB from '@backend/data_access/DB';
import Session from '@backend/models/core/Session';


export default class Entity {
    
    static async find({session, entity_type_slug, entity_slug}) {
       const db = new DB();
      //const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      //const sme_tenant_id = session_data.sme_tenant_id;
      
      const sql = `SELECT entities.id, entities.slug, attributes.name, attributes.type, 
        \`values\`.value_string, 
        \`values\`.value_long_string,
        \`values\`.value_integer, 
        \`values\`.value_datetime, 
        \`values\`.value_double
        
        FROM entities 
        LEFT JOIN attributes ON entities.id = attributes.entity_id
        LEFT JOIN \`values\` ON entities.id = \`values\`.entity_id AND attributes.id = \`values\`.attribute_id
        WHERE entities.slug = :entity_slug
        `;


      let executeStatementParam = [
        //{name: 'entity_type_slug', value:{longValue: entity_type_slug}},
        {name: 'entity_slug', value:{stringValue: entity_slug}},
      ];
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
      //return data.records;
     
      return data.records.map(([
        {longValue: id},
        {stringValue: slug},
        {stringValue: attribute_name},
        {stringValue: attribute_type},
        {stringValue: value_string},
        {stringValue: value_long_string},
        {longValue: value_integer},
        {stringValue: value_datetime},
        {doubleValue: value_double}
      ]) => ({
        id, slug, attribute_name, attribute_type, value_string, value_long_string, value_integer, value_datetime, value_double  
      }));     
    }
}
  