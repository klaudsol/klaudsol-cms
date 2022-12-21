import DB from '@backend/data_access/DB';


export default class Attribute {

    static async where_entity_type_slug({entity_type_slug}) {
      const db = new DB();

      const sql = `SELECT entities.id, entity_types.id, entity_types.name, entity_types.slug,                   
      attributes.name, attributes.type, attributes.\`order\`
      FROM  entity_types ON entities.entity_type_id = entity_types.id
      LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
      LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
      WHERE 
          entity_types.slug = :entity_type_slug  
      ORDER BY entities.id, attributes.\`order\` ASC
          `;
                
      const data = await db.executeStatement(sql, [
          {name: 'entity_type_slug', value:{stringValue: entity_type_slug}},
      ]);
      
      return data.records.map(([
          {longValue: id},
          {longValue: entity_type_id},
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
          entity_type_id,
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
  
  static async create({entity_type_id, name, type, order}) {
    const db = new DB();

    const insertSQL = 'INSERT into attributes (`entity_type_id`, `name`, `type`, `order`) VALUES (:entity_type_id, :name, :type, :order)';
    
    await db.executeStatement(insertSQL, [
      {name: 'entity_type_id', value:{longValue: entity_type_id}},
      {name: 'name', value:{stringValue: name}},
      {name: 'type', value:{stringValue: type}},
      {name: 'order', value:{longValue: order}},
    ]);

  }
}






