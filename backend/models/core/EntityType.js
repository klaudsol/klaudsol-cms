import DB from '@klaudsol/commons/lib/DB';

class EntityTypes {
  /** get all entity types (for submenu list) */
  static async all() {
    const db = new DB();

    const sql = `
        SELECT 
          entity_types.id, 
          entity_types.name, 
          entity_types.slug,
          entity_types.icon,
          entity_types.variant
        FROM entity_types
          `;

    const data = await db.executeStatement(sql, []);

    return data.records.map(
      ([
        { longValue: entity_type_id },
        { stringValue: entity_type_name },
        { stringValue: entity_type_slug },
        { stringValue: entity_type_icon },
        { stringValue: entity_type_variant }
      ]) => ({
        entity_type_id,
        entity_type_name,
        entity_type_slug,
        entity_type_icon,
        entity_type_variant
      })
    );
  }

  //findBy* - returns only one entry
  static async findBySlug(slug, { db: _db } = {}) {
    const db = _db ?? new DB();

    const sql = `
        SELECT 
          entity_types.id, 
          entity_types.name, 
          entity_types.slug,
          entity_types.icon
        FROM entity_types 
        WHERE entity_types.slug = :slug LIMIT 1
          `;

    const data = await db.executeStatement(sql, [
      { name: "slug", value: { stringValue: slug } },
    ]);

    return data.records.map(
      ([
        { longValue: entity_type_id },
        { stringValue: entity_type_name },
        { stringValue: entity_type_slug },
        { stringValue: entity_type_icon }
      ]) => ({
        entity_type_id,
        entity_type_name,
        entity_type_slug,
        entity_type_icon
      })
    )[0];
  }

  //TODO: Refactor as whereSlug
  static async find({ slug }) {
    console.error(
      "EntityType.find is deprecated. Use EntityType.whereSlug instead."
    );
    const db = new DB();

    const sql = `
        SELECT 
          entity_types.id,
          entity_types.name,
          entity_types.slug,
          entity_types.icon,
          entity_types.variant,
          attributes.name,
          attributes.type,
          attributes.order,
          attributes.id,
          attributes.custom_name
        FROM entity_types LEFT JOIN attributes ON entity_types.id = attributes.entity_type_id 
        WHERE entity_types.slug = :slug
        ORDER BY attributes.\`order\` ASC
          `;

    const data = await db.executeStatement(sql, [
      { name: "slug", value: { stringValue: slug } },
    ]);

    return data.records.map(
      ([
        { longValue: entity_type_id },
        { stringValue: entity_type_name },
        { stringValue: entity_type_slug },
        { stringValue: entity_type_icon },
        { stringValue: entity_type_variant },
        { stringValue: attribute_name },
        { stringValue: attribute_type },
        { longValue: attribute_order },
        { longValue: attribute_id },
        { stringValue: attribute_custom_name },
      ]) => ({
        entity_type_id,
        entity_type_name,
        entity_type_slug,
        entity_type_icon,
        entity_type_variant,
        attribute_name,
        attribute_type,
        attribute_order,
        attribute_id,
        attribute_custom_name
      })
    );
  }

  static async whereSlug({ slug }) {
    return this.find({ slug });
  }

  static async create({ name, slug, variant }) {
    const db = new DB();

    const insertEntitiesSQL = "INSERT INTO entity_types (slug, name, variant) VALUES (:slug, :name, :variant)";

    await db.executeStatement(insertEntitiesSQL, [
      { name: "slug", value: { stringValue: slug } },
      { name: "name", value: { stringValue: name } },
      { name: "variant", value: { stringValue: variant } },
    ]);

    //TODO: return something valuable here
    return true;
  }

  static async delete({ slug }) {
    const db = new DB();
    const deleteEntityTypesSQL = "DELETE FROM entity_types WHERE slug = :slug";

    let executeStatementParam = [
      { name: "slug", value: { stringValue: slug } },
    ];
    await db.executeStatement(deleteEntityTypesSQL, executeStatementParam);

    //TODO: return something valuable here
    return true;
  }

  static async update({ name, newSlug, oldSlug }) {
    const db = new DB();
    const updateEntityTypesSQL = "UPDATE entity_types SET slug = :newSlug, name = :name WHERE slug = :oldSlug";
    const executeStatementParam = [
      { name: "name", value: { stringValue: name } },
      { name: "newSlug", value: { stringValue: newSlug } },
      { name: "oldSlug", value: { stringValue: oldSlug } },
    ];

    await db.executeStatement(updateEntityTypesSQL, executeStatementParam);

    //TODO: return something valuable here
    return true;
  }

  static async updateIcon({ slug, icon }) {
    const db = new DB();

    const updateEntityTypesSQL = "UPDATE entity_types SET icon = :icon WHERE slug = :slug";
    const executeStatementParam = [
      { name: "icon", value: { stringValue: icon } },
      { name: "slug", value: { stringValue: slug } },
    ];

    await db.executeStatement(updateEntityTypesSQL, executeStatementParam);

    //TODO: return something valuable here
    return true;
  }
}

export default EntityTypes;
