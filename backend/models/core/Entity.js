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
                  LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
                  LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
                  WHERE 
                      entity_types.slug = :entity_type_slug AND 
                      entities.id = :id
                  ORDER BY attributes.\`order\` ASC
                  `;
                
      const data = await db.executeStatement(sql, [
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

    static async findBySlug({entity_type_slug, slug}) {
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
                  LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
                  LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
                  WHERE 
                      entity_types.slug = :entity_type_slug AND 
                      entities.slug = :slug
                  ORDER BY attributes.\`order\` ASC
                  `;
                
      const data = await db.executeStatement(sql, [
          {name: 'entity_type_slug', value:{stringValue: entity_type_slug}},
          {name: 'slug', value:{stringValue: slug}},
      ]);
      
      return data.records.map(([
          {longValue: entity_type_id},
          {stringValue: slug},
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
          entity_type_id,
          slug, 
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

    //Work in progress
    static async create({slug, entity_type_id, ...entry}) {
      const db = new DB();

      const entriesFormatted = Object.keys(entry).reduce((acc, curr) => {
          if (typeof entry[curr] === 'object') return { ...acc, [curr]: entry[curr].originalName }

          return { ...acc, [curr]: entry[curr] };
      }, {});
  
      //TODO: start transaction
      
      
      //Insert Entity
      const insertEntitiesSQL = `INSERT into entities (
            slug, 
            entity_type_id
        ) VALUES (
            :slug, 
            :entity_type_id
        )`;
      
      await db.executeStatement(insertEntitiesSQL, [
        { name: 'slug', value: { stringValue: slug } },
        { name: 'entity_type_id', value: { longValue: entity_type_id } },
      ]);
      
      
      const { records: [ [ { longValue: lastInsertedEntityID } ] ] } = await db.executeStatement('SELECT LAST_INSERT_ID()');
      console.error(lastInsertedEntityID);
      
       //Attribute Introspection
      const entityIntrospectionSQL = `SELECT id, name, type 
        FROM attributes 
        WHERE 
            entity_type_id = :entity_type_id 
        ORDER by \`order\``;
      
      const attributes = await db.executeStatement(entityIntrospectionSQL, [
        { name: 'entity_type_id', value:{ longValue: entity_type_id } },
      ]);
      
      const valueBatchParams = attributes.records.reduce((collection, record) => {
        const [
          { longValue: attributeId },
          { stringValue: attributeName },
          { stringValue: attributeType },
        ] = record;
        
        return [ 
          ...collection,
          [
            { name: 'entity_id', value: { longValue: lastInsertedEntityID } },
            { name: 'attribute_id', value: { longValue: attributeId } },
            //Refactor to encapsulate type switch
            { name: 'value_string', value: ( attributeType == 'text' || attributeType == 'image' || attributeType == 'link' ) ? { stringValue: entriesFormatted[attributeName] } : { isNull: true } },
            { name: 'value_long_string', value:  attributeType == 'textarea' ? { stringValue: entriesFormatted[attributeName] } : { isNull: true } },
            { name: 'value_double', value:  attributeType == 'float' ? { doubleValue: entriesFormatted[attributeName] } : { isNull: true } },
          ]
        ]
      }, []); 
      
      //Insert Values by batch
      const insertValuesBatchSQL = `INSERT INTO \`values\`(
            entity_id, 
            attribute_id,
            value_string, 
            value_long_string, 
            value_double  
        ) VALUES (
            :entity_id, 
            :attribute_id, 
            :value_string, 
            :value_long_string, 
            :value_double
        )`; 
      
      await db.batchExecuteStatement(insertValuesBatchSQL,valueBatchParams);
        
      // Gets the rows in `values` table that have images
      const imageAttributes = attributes.records.filter((attribute) => attribute[2].stringValue === 'image');
      const imageAttributesIDs = imageAttributes.map((attribute) => attribute[0].longValue)
      const joinedAttributes = imageAttributesIDs.join(', ');
      // I had to manually put the joinedAttributes below because if I were to put it on the 2nd
      // parameter in the values variable, then it will only catch 1 row, not all of it
      const valueIDsSQL = `SELECT id, attribute_id, value_string 
            FROM \`values\` 
            WHERE 
                entity_id = :entity_id 
            AND 
                attribute_id IN (${joinedAttributes}) 
            `;

      const values = await db.executeStatement(valueIDsSQL,[
        { name: 'entity_id', value: { longValue: lastInsertedEntityID } },
        /* { name: 'attribute_ids', value: { stringValue: joinedAttributes } } */
      ]);

      // Populates the `image` table
      const imageBatchParams = values.records.reduce((collection, record) => {
        const [
          { longValue: valueId },
          { longValue: attributeId },
          { stringValue: imageName },
        ] = record;

        // The return from SELECT in SQL MIGHT not guarantee order
        // Line of code below should guarantee order
        const currentImageAttribute = imageAttributes.find((attr) => attr[0].longValue === attributeId);
        const imageAttributeName = currentImageAttribute[1].stringValue;
        const imageAttributeId = currentImageAttribute[0].longValue;
        const imageData = entry[imageAttributeName];

        return [ 
          ...collection,
          [
            { name: 'value_id', value: { longValue: valueId } },
            { name: 'attribute_id', value: { longValue: imageAttributeId } },
            //Refactor to encapsulate type switch
            { name: 'link', value: { stringValue: imageData.link } },
            { name: 'name', value: { stringValue: imageData.name } },
          ]
        ]
      }, []); 

      const insertImagesBatchSQL = `INSERT INTO \`images\`(
            value_id, 
            attribute_id,
            link, 
            name 
        ) VALUES (
            :value_id, 
            :attribute_id, 
            :link, 
            :name 
        )`; 

      await db.batchExecuteStatement(insertImagesBatchSQL,imageBatchParams);

      //TODO: end transaction
  
      return true;
    }
  

  static async delete({id}) {
    const db = new DB();
    const deleteEntitiesSQL = 'DELETE from entities where id = :id'
    const deleteAttributesSQL = 'DELETE from attributes where entity_type_id = :id'
    const deleteValuesSQL = 'DELETE from \`values\` where entity_id = :id'

    let executeStatementParam = [
      {name: 'id', value:{stringValue: id}}
    ]
    await db.executeStatement(deleteEntitiesSQL, executeStatementParam);
    await db.executeStatement(deleteAttributesSQL, executeStatementParam);
    await db.executeStatement(deleteValuesSQL, executeStatementParam);

    return true;
  }
    //Work in progress
  static async update({entries, entity_type_id, entity_id}) {
    
    const db = new DB();

    //TODO: start transaction
    
    //Attribute Introspection
    const entityIntrospectionSQL = `SELECT id, name, type FROM attributes 
      WHERE entity_type_id = :entity_type_id ORDER by \`order\``;
    
    const attributes = await db.executeStatement(entityIntrospectionSQL, [
      {name: 'entity_type_id', value:{longValue: entity_type_id}},
    ]);
    
    const valueBatchParams = attributes.records.reduce((collection, record) => {
      const [
        {longValue: attributeId},
        {stringValue: attributeName},
        {stringValue: attributeType},
      ] = record;
      
      return [ 
        ...collection,
        [
          {name: 'entity_id', value: {longValue: entity_id}},
          {name: 'attribute_id', value: {longValue: attributeId}},
            //Refactor to encapsulate type switch
          {name: 'value_string', value: (attributeType == 'text' || attributeType == 'image' || attributeType == 'link') ? {stringValue: entries[attributeName]} : {isNull: true}},
          {name: 'value_long_string', value:  attributeType == 'textarea' ? {stringValue: entries[attributeName]} : {isNull: true}},
          {name: 'value_double', value:  attributeType == 'float' ? {doubleValue: entries[attributeName]} : {isNull: true}},
        ]
      ]    
      
    }, []); 
    
    
    //Insert Values by batch
    const insertValuesBatchSQL = `UPDATE \`values\` SET 
    value_string = :value_string, 
    value_long_string = :value_long_string, 
    value_double = :value_double 
    WHERE entity_id = :entity_id AND attribute_id = :attribute_id
    `; 

    await db.batchExecuteStatement(insertValuesBatchSQL,valueBatchParams);
    

    
    //TODO: end transaction

    return true;
  }

}





export default Entity;
