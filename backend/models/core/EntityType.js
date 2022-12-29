import DB from '@backend/data_access/DB';

class EntityTypes {

    /** get all entity types (for submenu list) */
    static async all() {
        const db = new DB();
  
        const sql = `SELECT entity_types.id, entity_types.name, entity_types.slug from entity_types`;
         
        const data = await db.executeStatement(sql, []);
        
        return data.records.map(([
            {longValue: entity_type_id},
            {stringValue: entity_type_name},
            {stringValue: entity_type_slug},
          ]) => ({
            entity_type_id, entity_type_name, entity_type_slug
          })); 
    }

    //findBy* - returns only one entry
    static async findBySlug(slug, {db: _db} = {}) {
      const db = _db ?? new DB();
  
      const sql = `SELECT entity_types.id, entity_types.name, entity_types.slug from entity_types WHERE entity_types.slug = :slug LIMIT 1`;
       
      const data = await db.executeStatement(sql, [
        {name: 'slug', value:{stringValue: slug}},
    ]);;
      
      return data.records.map(([
          {longValue: entity_type_id},
          {stringValue: entity_type_name},
          {stringValue: entity_type_slug},
        ]) => ({
          entity_type_id, entity_type_name, entity_type_slug
        }))[0];
    }

    //TODO: Refactor as whereSlug
    static async find({slug}) {
      console.error("EntityType.find is deprecated. Use EntityType.whereSlug instead.");
      const db = new DB();

      const sql = `
        SELECT 
          entity_types.id,
          entity_types.name,
          entity_types.slug,
          attributes.name,
          attributes.type,
          attributes.order,
          attributes.id
        FROM entity_types LEFT JOIN attributes ON entity_types.id = attributes.entity_type_id 
        WHERE entity_types.slug = :slug
        ORDER BY attributes.\`order\` ASC
          `;
                
      const data = await db.executeStatement(sql, [
          {name: 'slug', value:{stringValue: slug}},
      ]);

      return data.records.map(([
        {longValue: entity_type_id},
        {stringValue: entity_type_name},
        {stringValue: entity_type_slug},
        {stringValue: attribute_name},
        {stringValue: attribute_type},
        {longValue: attribute_order},
        {longValue: attribute_id}
      ]) => ({
        entity_type_id, entity_type_name, entity_type_slug,
        attribute_name, attribute_type, attribute_order, attribute_id
      })); 

    } 

    static async whereSlug({slug}) {
      return this.find({slug});
    }

    static async create({name, slug}) {

      const db = new DB();

      const insertEntitiesSQL = 'INSERT into entity_types (slug, name) VALUES (:slug, :name)';
      
      await db.executeStatement(insertEntitiesSQL, [
        {name: 'slug', value:{stringValue: slug}},
        {name: 'name', value:{stringValue: name}},
      ]);

      //TODO: return something valuable here
      return true;

    }


    static async create({name, slug}) {

      const db = new DB();

      const insertEntitiesSQL = 'INSERT into entity_types (slug, name) VALUES (:slug, :name)';
      
      await db.executeStatement(insertEntitiesSQL, [
        {name: 'slug', value:{stringValue: slug}},
        {name: 'name', value:{stringValue: name}},
      ]);

      //TODO: return something valuable here
      return true;

    }

    static async delete({slug}) {
      const db = new DB();
      const deleteEntityTypesSQL = 'DELETE from entity_types where slug = :slug'
  
      let executeStatementParam = [
        {name: 'slug', value:{stringValue: slug}}
      ]
      await db.executeStatement(deleteEntityTypesSQL, executeStatementParam);
  
      //TODO: return something valuable here
      return true;
    }
}

export default EntityTypes;