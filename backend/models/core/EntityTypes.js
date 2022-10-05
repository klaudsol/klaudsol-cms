import DB from '@backend/data_access/DB';

class EntityTypes {

    /** get all entity types (for submenu list) */
    static async all() {
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
}

export default EntityTypes;