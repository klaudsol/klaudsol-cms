import DB from '@backend/data_access/DB';


class Entity {

    static async find({entity_type_slug, id}) {
      const db = new DB();

      const sql = `SELECT entities.id, entity_types.id, entity_types.name, entity_types.slug, entities.slug, 
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

    static async where({entity_type_slug}) {
      const db = new DB();

      const sql = `SELECT entities.id, entity_types.id, entity_types.name, entity_types.slug, entities.slug, 
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

  static async create({entries, columns, slug, entity_type_id}) {
    const db = new DB();

    let attributesValues = ``, insertAttributesSQL = ``;

    let values =``, insertValuesSql = ``;
    let dec = columns.length - 1;

    const insertEntitiesSQL = `INSERT into entities (slug, entity_type_id) VALUES (:slug, :entity_type_id)`;
    //const isEntities = true;    
    
    const isEntities = await db.exectuteStatement(insertEntitiesSQL, [
      {name: 'slug', value:{stringValue: slug}},
      {name: 'entity_type_id', value:{longValue: entity_type_id}},
    ]);
    
    if(isEntities) {
      
    let temp = [];

    columns.map((col, i) => {
      entries[`${col}_type`] === 'text' ? temp.push({value_string: entries[col]}) : null;
      entries[`${col}_type`] === 'textarea' ? temp.push({value_long_string: entries[col]}) : null;
      entries[`${col}_type`] === 'float' ? temp.push({value_double: entries[col]}) : null;

      attributesValues += ` ${i > 0 ? ',' : ''}('${col}', (SELECT ID from entities ORDER by id desc limit 1),  '${entries[`${col}_type`]}', ${i+1})`;
      values += ` ${i > 0 ? ',' : ''}((SELECT ID from entities ORDER by id desc limit 1), (SELECT ID from attributes ORDER by id desc limit 1)-${dec},${entries[`${col}_type`] === 'text' ? entries[col] : null}, ${entries[`${col}_type`] === 'textarea' ? entries[col] : null}, ${entries[`${col}_type`] === 'float' ? entries[col] : null})`;
      dec--;
    })

    insertAttributesSQL = `INSERT into attributes (name, entity_id, type, \`order\`) VALUES ${attributesValues}`;
    
    const isAttributes = await db.exectuteStatement(insertAttributesSQL, []);

    if(isAttributes) {
      insertValuesSql = `INSERT into \`values\` (entity_id, attribute_id, value_string, value_long_string, value_double) VALUES ${values}`;
      const isValues = await db.exectuteStatement(insertValuesSql, []);
    }

    }

    return true;
  }
}

export default Entity;
