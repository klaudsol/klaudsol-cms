import DB from '@klaudsol/commons/lib/DB';
import { isNumber, generateSQL } from "@/components/Util";

class Entity {
  static async findBySlugOrId({ entity_type_slug, slug }) {
    const db = new DB();

    // slug can be id # (number) or slugname (string)
    // check the slug weather it consists numbers only in which return true, otherwise it will return false

    const propertyType = isNumber(slug) ? "longValue" : "stringValue";
    const conditionType = isNumber(slug) ? "entities.id" : "entities.slug";

    // if the type of slug is a number, propertyType and conditionType will be longValue and enitities.id respectively,
    // and will be used for the query's condition WHERE and property name for "slug" in the map method

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
                      ${conditionType} = :slug
                  ORDER BY attributes.\`order\` ASC
                  `;

    const data = await db.executeStatement(sql, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
      { name: "slug", value: { [propertyType]: slug } },
    ]);

    return data.records.map(
      ([
        { longValue: entity_type_id },
        { longValue: slug },
        { stringValue: entity_type_name },
        { stringValue: entity_type_slug },
        { stringValue: entities_slug },
        { stringValue: attributes_name },
        { stringValue: attributes_type },
        { longValue: attributes_order },
        { stringValue: value_string },
        { stringValue: value_long_string },
        { longValue: value_integer },
        { stringValue: value_datetime },
        { stringValue: value_double },
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
        value_double,
      })
    );
  }

  static async where(
    { entity_type_slug, entry = undefined, page = undefined },
    queries
  ) {
    const db = new DB();

    let generatedSQL;

    if (Object.values(queries).length) {
      generatedSQL = generateSQL(queries, entity_type_slug);
    }

    let limit;
    let offset;
    let filterQuery;
    let limitAndOffsetQuery;

    const totalTypesSQL = `
    SELECT COUNT(entity_types.id)
    from entity_types 
    LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
    WHERE entity_types.slug = :entity_type_slug`;

    const totalTypesData = await db.executeStatement(totalTypesSQL, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
    ]);
    const [{ longValue: totalTypes }] = totalTypesData.records[0];

    limit = entry && totalTypes !== 0 ? totalTypes * entry : 10;
    offset = page ? limit * page : 0;

    limitAndOffsetQuery =
      entry && page ? `LIMIT ${limit} OFFSET ${offset}` : "";

    filterQuery = generatedSQL ? `AND entities.id IN (${generatedSQL})` : "";

    const sqlData = `SELECT entities.id, entity_types.id, entity_types.name, entity_types.slug, entities.slug, 
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
                    ${filterQuery}
                ORDER BY entities.id, attributes.\`order\` ASC
                    ${limitAndOffsetQuery}
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
        { stringValue: attributes_name },
        { stringValue: attributes_type },
        { longValue: attributes_order },
        { stringValue: value_string },
        { stringValue: value_long_string },
        { longValue: value_integer },
        { stringValue: value_datetime },
        { stringValue: value_double },
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
        value_double,
      })
    );

    const sqlRowData = `SELECT COUNT(*)
    FROM (SELECT DISTINCT entities.slug FROM entities
                LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
                LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
                LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
                WHERE entity_types.slug = :entity_type_slug ${filterQuery}
                ) AS subquery`;

    const dataRow = await db.executeStatement(sqlRowData, [
      { name: "entity_type_slug", value: { stringValue: entity_type_slug } },
    ]);

    const [{ longValue: totalRow }] = dataRow.records[0];
    
    return { total_rows: totalRow, data };
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
          {
            name: "value_string",
            value:
              attributeType == "text" ||
              attributeType == "image" ||
              attributeType == "link"
                ? { stringValue: entry[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_long_string",
            value:
              attributeType == "textarea"
                ? { stringValue: entry[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_double",
            value:
              attributeType == "float"
                ? { doubleValue: entry[attributeName] }
                : { isNull: true },
          },
        ],
      ];
    }, []);

    //Insert Values by batch
    const insertValuesBatchSQL = `INSERT INTO \`values\`(entity_id, attribute_id,
        value_string, value_long_string, value_double  
      ) VALUES (:entity_id, :attribute_id, :value_string, :value_long_string, :value_double) 
      `;

    await db.batchExecuteStatement(insertValuesBatchSQL, valueBatchParams);

    //TODO: end transaction

    return true;
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
  static async update({ entries, entity_type_slug, entity_id }) {
    const db = new DB();
    // entity_type_slug will always be a string
    // entity_id can be a string or a number
    // check the entity_id weather it consists numbers only in which return true, otherwise it will return false

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
                attributeType == "link") &&
              entries[attributeName]
                ? { stringValue: entries[attributeName] }
                : { isNull: true },
          },
          {
            name: "value_long_string",
            value:
              attributeType == "textarea" && entries[attributeName]
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
      value_string, value_long_string, value_double  
    ) VALUES (:entity_id, :attribute_id, :value_string, :value_long_string, :value_double) 
    `;

      await db.batchExecuteStatement(insertValuesBatchSQL, nonExistingVal);
      console.log("created");
    }

    //Insert Values by batch
    const updateValuesBatchSQL = `UPDATE \`values\` SET 
    value_string = :value_string, 
    value_long_string = :value_long_string, 
    value_double = :value_double 
    WHERE entity_id = :entity_id AND attribute_id = :attribute_id
    `;

    await db.batchExecuteStatement(updateValuesBatchSQL, valueBatchParams);

    //TODO: end transaction
    return true;
  }
}

export default Entity;
