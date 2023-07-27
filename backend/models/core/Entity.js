import DB from '@klaudsol/commons/lib/DB';
import { isNumber, generateSQL } from "@/components/Util";
import RecordNotFound from '@klaudsol/commons/errors/RecordNotFound';

class Entity {
  static async findBySlugOrId({ entity_type_slug, slug }) {
    const db = new DB();

    // slug can be id # (number) or slugname (string)
    // check the slug weather it consists numbers only in which return true, otherwise it will return false

    const propertyType = isNumber(slug) ? "longValue" : "stringValue";
    const conditionType = isNumber(slug) ? "entities.id" : "entities.slug";

    // if the type of slug is a number, propertyType and conditionType will be longValue and enitities.id respectively,
    // and will be used for the query's condition WHERE and property name for "slug" in the map method

    const sql = `SELECT entities.id, entities.slug, entities.status, entity_types.id, entity_types.name, entity_types.slug,
                  attributes.name, attributes.type, attributes.\`order\`, attributes.custom_name,
                  \`values\`.value_string, 
                  \`values\`.value_long_string, 
                  \`values\`.value_integer, 
                  \`values\`.value_datetime, 
                  \`values\`.value_double,        
                  \`values\`.value_boolean                       
                  FROM entities
                  LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
                  LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
                  LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
                  WHERE 
                      entity_types.slug = :entity_type_slug AND 
                      ${conditionType} = :slug
                  ORDER BY attributes.\`order\` ASC
                  `;

    const data = await db.executeStatement(sql, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
      { name: "slug", value: { [propertyType]: slug } },
    ]);

    return data.records.map(
      ([
        { longValue: id },
        { stringValue: slug },
        { stringValue: status },
        { longValue: entity_type_id },
        { stringValue: entity_type_name },
        { stringValue: entity_type_slug },
        { stringValue: attributes_name },
        { stringValue: attributes_type },
        { longValue: attributes_order },
        { stringValue: attributes_custom_name },
        { stringValue: value_string },
        { stringValue: value_long_string },
        { longValue: value_integer },
        { stringValue: value_datetime },
        { stringValue: value_double },
        { booleanValue: value_boolean },
      ]) => ({
        id,
        slug,
        status,
        entity_type_id,
        entity_type_name,
        entity_type_slug,
        attributes_name,
        attributes_type,
        attributes_order,
        attributes_custom_name,
        value_string,
        value_long_string,
        value_integer,
        value_datetime,
        value_double,
        value_boolean
      })
    );
  }

  static async where({ entity_type_slug, entry, page, drafts }, queries) {
    const db = new DB();
    
    let generatedSQL;

    if(Object.values(queries).length){
      generatedSQL = generateSQL(queries, entity_type_slug);      
    }
    
    let totalRows;
    let totalOrders;
   
    const totalRowsSQL = `SELECT COUNT(entities.id) 
                          from entity_types LEFT JOIN entities ON entities.entity_type_id = entity_types.id 
                          WHERE entity_types.slug = :entity_type_slug;
                           `;

    const totalRowsData = await db.executeStatement(totalRowsSQL, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
    ]);

    [{ longValue: totalRows }] = totalRowsData.records[0];

    const totalOrdersSQL = `SELECT COUNT(attributes.order)
    from entity_types LEFT JOIN entities ON entities.entity_type_id = entity_types.id 
    LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
    WHERE entity_types.slug = :entity_type_slug`;

    const totalOrdersData = await db.executeStatement(totalOrdersSQL, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
    ]);
    [{ longValue: totalOrders }] = totalOrdersData.records[0];

    let limit =
      entry && totalOrders !== 0 && totalRows !== 0
        ? (totalOrders / totalRows) * entry
        : 10;
    let offset = page ? limit * page : 0;

    const sqlData = `SELECT entities.id, entity_types.id, entity_types.name, entity_types.slug, entities.slug, entities.status,
                attributes.name, attributes.type, attributes.\`order\`, attributes.custom_name,
                \`values\`.value_string, 
                \`values\`.value_long_string, 
                \`values\`.value_integer, 
                \`values\`.value_datetime, 
                \`values\`.value_double,
                \`values\`.value_boolean                  
                FROM entities
                LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
                LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
                LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
                WHERE 
                    entity_types.slug = :entity_type_slug
                    ${drafts !== "true" ? "AND entities.status = 'published'" : "" /* No params, should be safe */}
                    ${generatedSQL ? `AND entities.id IN (${generatedSQL})` : ''}
                ORDER BY entities.id, attributes.\`order\` ASC
                ${entry && page ? `LIMIT ${limit} OFFSET ${offset}` : " "}
                `;
    
    const dataRaw = await db.executeStatement(sqlData, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
    ]);

    const data = dataRaw.records.map(
      ([
        { longValue: id },
        { longValue: entity_type_id },
        { stringValue: entity_type_name },
        { stringValue: entity_type_slug },
        { stringValue: entities_slug },
        { stringValue: entities_status },
        { stringValue: attributes_name },
        { stringValue: attributes_type },
        { longValue: attributes_order },
        { stringValue: attributes_custom_name },
        { stringValue: value_string },
        { stringValue: value_long_string },
        { longValue: value_integer },
        { stringValue: value_datetime },
        { stringValue: value_double },
        { booleanValue: value_boolean },
      ]) => ({
        id,
        entity_type_id,
        entity_type_name,
        entity_type_slug,
        entities_slug,
        entities_status,
        attributes_name,
        attributes_type,
        attributes_order,
        attributes_custom_name,
        value_string,
        value_long_string,
        value_integer,
        value_datetime,
        value_double,
        value_boolean,
      })
    );

    return { total_rows: totalRows, data };
  }

  //Work in progress
  static async create({ slug, entity_type_id, ...entry }) {
    const db = new DB();

    //TODO: start transaction

    //Insert Entity
    const insertEntitiesSQL =
      "INSERT into entities (slug, entity_type_id) VALUES (:slug, :entity_type_id)";

    await db.executeStatement(insertEntitiesSQL, [
      { name: "slug", value: { stringValue: slug } },
      { name: "entity_type_id", value: { longValue: entity_type_id } },
    ]);

    const {
      records: [[{ longValue: lastInsertedEntityID }]],
    } = await db.executeStatement("SELECT LAST_INSERT_ID()");
    console.error(lastInsertedEntityID);

    //Attribute Introspection
    const entityIntrospectionSQL = `SELECT id, name, type FROM attributes 
        WHERE entity_type_id = :entity_type_id ORDER by \`order\``;

    const attributes = await db.executeStatement(entityIntrospectionSQL, [
      { name: "entity_type_id", value: { longValue: entity_type_id } },
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
          { name: "entity_id", value: { longValue: lastInsertedEntityID } },
          { name: "attribute_id", value: { longValue: attributeId } },
          //Refactor to encapsulate type switch
          //TODO: Refactor this logic inside AttributeTypeFactory
          {
            name: "value_string",
            value:
              attributeType == "text" ||
              attributeType == "image" ||
              attributeType == "link" ||
              attributeType === "video" ||
              attributeType == "file" 
                ? { stringValue: entry[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_long_string",
            value:
              attributeType == "textarea" ||
              attributeType === "gallery" ||
              attributeType === "rich-text" ||
              attributeType == "custom"
                ? { stringValue: entry[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_double",
            value:
              attributeType == "float" && entry[attributeName].trim() != ''
                ? { doubleValue: entry[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_boolean",
            value:
              attributeType == "boolean"
                ? { booleanValue: entry[attributeName] }
                : { isNull: true },
          },
        ],
      ];
    }, []);

    //Insert Values by batch
    const insertValuesBatchSQL = `INSERT INTO \`values\`(entity_id, attribute_id,
        value_string, value_long_string, value_double, value_boolean  
      ) VALUES (:entity_id, :attribute_id, :value_string, :value_long_string, :value_double, :value_boolean) 
      `;

    await db.batchExecuteStatement(insertValuesBatchSQL, valueBatchParams);

    //TODO: end transaction

    return true;
  }

  // Almost the same as Entites.create but no values
  static async createDraft({ entity_type_id }) {
    const db = new DB();

    //TODO: start transaction

    //Insert Entity
    const insertEntitiesSQL =
      "INSERT into entities (slug, entity_type_id, status) VALUES ('', :entity_type_id, 'draft')";

    await db.executeStatement(insertEntitiesSQL, [
      { name: "entity_type_id", value: { longValue: entity_type_id } },
    ]);

    const {
      records: [[{ longValue: lastInsertedEntityID }]],
    } = await db.executeStatement("SELECT LAST_INSERT_ID()");
    console.error(lastInsertedEntityID);

    //Attribute Introspection
    const entityIntrospectionSQL = `SELECT id, name, type FROM attributes 
        WHERE entity_type_id = :entity_type_id ORDER by \`order\``;

    const attributes = await db.executeStatement(entityIntrospectionSQL, [
      { name: "entity_type_id", value: { longValue: entity_type_id } },
    ]);

    const valueBatchParams = attributes.records.reduce((collection, record) => {
      const [
        { longValue: attributeId },
      ] = record;

      return [
        ...collection,
        [
          { name: "entity_id", value: { longValue: lastInsertedEntityID } },
          { name: "attribute_id", value: { longValue: attributeId } },
        ],
      ];
    }, []);

    //Insert Values by batch
    const insertValuesBatchSQL = `
        INSERT INTO \`values\`(entity_id, attribute_id)
        VALUES (:entity_id, :attribute_id)
    `;

    await db.batchExecuteStatement(insertValuesBatchSQL, valueBatchParams);

    //TODO: end transaction

    return { id: lastInsertedEntityID };
  }

  static async getDraft() {
    const db = new DB();

    const getDraftSql = "SELECT * FROM entities WHERE status = 'draft' LIMIT 1";

    const { records } = await db.executeStatement(getDraftSql);

    if (records.length === 0) throw new RecordNotFound();

    const [
        { longValue: id },
        { stringValue: slug },
        { longValue: entity_type_id },
        { stringValue: status }
    ] = records[0];

    return { id, slug, entity_type_id, status }
  }

  static async delete({ id }) {
    const db = new DB();
    const deleteEntitiesSQL = "DELETE from entities where id = :id";
    const deleteAttributesSQL =
      "DELETE from attributes where entity_type_id = :id";
    const deleteValuesSQL = "DELETE from `values` where entity_id = :id";

    let executeStatementParam = [{ name: "id", value: { longValue: id } }];
    await db.executeStatement(deleteEntitiesSQL, executeStatementParam);
    await db.executeStatement(deleteAttributesSQL, executeStatementParam);
    await db.executeStatement(deleteValuesSQL, executeStatementParam);

    return true;
  }
  //Work in progress
  static async update({ slug, status, entries, entity_type_slug, entity_id }) {
    const db = new DB();
    // entity_type_slug will always be a string
    // entity_id can be a string or a number
    // check the entity_id weather it consists numbers only in which return true, otherwise it will return false

    const updateEntitySql = `UPDATE entities SET 
                                slug = :slug,
                                status = :status
                            WHERE 
                                id = :id`;

    await db.executeStatement(updateEntitySql, [
      { name: "slug", value: { stringValue: slug } },
      { name: "status", value: { stringValue: status } },
      { name: "id", value: { longValue: entity_id } },
    ]);

    const { propertyType, conditionType } = isNumber(entity_id)
      ? { propertyType: "longValue", conditionType: "entities.id" }
      : { propertyType: "stringValue", conditionType: "entities.slug" };

    //TODO: start transaction
    //Attribute Introspection

    const entityIntrospectionSQL = `SELECT entities.id , attributes.id, attributes.name, attributes.type                 
    FROM entities
    LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
    LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
    LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
    WHERE entity_types.slug = :entity_type_slug AND 
    ${conditionType} = :entity_id ORDER BY attributes.\`order\``;

    const attributes = await db.executeStatement(entityIntrospectionSQL, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
      { name: "entity_id", value: { [propertyType]: entity_id } },
    ]);

    const valueBatchParams = attributes.records.reduce((collection, record) => {
      const [
        { longValue: entityId },
        { longValue: attributeId },
        { stringValue: attributeName },
        { stringValue: attributeType },
      ] = record;

      return [
        ...collection,
        [
          { name: "entity_id", value: { longValue: entityId } },
          { name: "attribute_id", value: { longValue: attributeId } },
          //Refactor to encapsulate type switch
          {
            name: "value_string",
            value:
              (attributeType == "text" ||
                attributeType == "image" ||
                attributeType == "video" ||
                attributeType == "file" ||
                attributeType == "link") &&
              entries[attributeName]
                ? { stringValue: entries[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_long_string",
            value:
              (attributeType == "textarea" ||
                attributeType === "gallery" ||
                attributeType === "rich-text" ||
                attributeType === "custom") && 
              entries[attributeName]
                ? { stringValue: entries[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_double",
            value:
              attributeType == "float" && entries[attributeName]
                ? { doubleValue: entries[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_boolean",
            value:
              attributeType == "boolean"
                ? { booleanValue: entries[attributeName] }
                : { isNull: true },
          },
        ],
      ];
    }, []);

    const getAllIdSQL = `SELECT \`values\`.attribute_id                 
    FROM entities
    LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
    LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
    LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
    WHERE entity_types.slug = :entity_type_slug AND 
    ${conditionType} = :entity_id`;

    const ids = await db.executeStatement(getAllIdSQL, [
      { name: "entity_id", value: { [propertyType]: entity_id } },
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
    ]);

    // return all the attribute_id from `values` that match the entity_id and :entity_type_slug (parameters)
    // use filter method on valueBatchParams and only return array/s that has no thesame value with any of the attributes_ids.
    // which means, some entries received from the frontend are yet to exist in the db table of `values`
    // therefore, we need to create

    const nonExistingVal = valueBatchParams.filter(
      (arr) =>
        !arr.some(
          (obj) =>
            obj.name === "attribute_id" &&
            ids.records.some(
              (idArr) => obj.value.longValue === idArr[0].longValue
            )
        )
    );

    if (nonExistingVal.length) {
      const insertValuesBatchSQL = `INSERT INTO \`values\`(entity_id, attribute_id,
      value_string, value_long_string, value_double, value_boolean  
    ) VALUES (:entity_id, :attribute_id, :value_string, :value_long_string, :value_double, :value_boolean) 
    `;

      await db.batchExecuteStatement(insertValuesBatchSQL, nonExistingVal);
      console.log("created");
    }

    //Insert Values by batch
    const updateValuesBatchSQL = `UPDATE \`values\` SET 
    value_string = :value_string, 
    value_long_string = :value_long_string, 
    value_double = :value_double, 
    value_boolean = :value_boolean
    WHERE entity_id = :entity_id AND attribute_id = :attribute_id
    `;

    await db.batchExecuteStatement(updateValuesBatchSQL, valueBatchParams);

    //TODO: end transaction
    return true;
  }
}

export default Entity;
