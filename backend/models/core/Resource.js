import DB from "@backend/data_access/DB";
import {
  stringTypes,
  longStringTypes,
  longValueTypes,
} from "@/components/cmsTypes";

class Resource {
  static async get({ slug }) {
    const db = new DB();
    const getResourceSQL = `SELECT * FROM \`resources\` WHERE slug = :slug`;

    const resource = await db.executeStatement(getResourceSQL, [
      { name: "slug", value: { stringValue: slug } },
    ]);

    return resource.records.map(
      ([
        { longValue: id },
        { stringValue: slug },
        { stringValue: type },
        { stringValue: value_string },
        { stringValue: value_long_string},
        { longValue: value_double}
      ]) => ({
        id,
        slug,
        type,
        value_string,
        value_long_string,
        value_double
      })
    );
  }

  static async create({ name, key, type }) {
    const db = new DB();
    const getResourceSQL = `SELECT * FROM \`resources\` WHERE slug = :slug`;

    const resource = await db.executeStatement(getResourceSQL, [
      { name: "slug", value: { stringValue: name } },
    ]);
  
    if (!resource.records.length) {
 
      const insertResourceSQL =
        "INSERT into `resources` (`slug`, `type`, `value_string`, `value_long_string`, `value_double`) VALUES (:slug, :type, :value_string, :value_long_string, :value_double)";

     await db.executeStatement(insertResourceSQL, [
        { name: "slug", value: { stringValue: name } },
        { name: "type", value: { stringValue: type } },
        { name: "value_string", value: stringTypes.includes(type) ? { stringValue: key } : { isNull: true } },
        { name: "value_long_string", value: longStringTypes.includes(type) ? { stringValue: key } : { isNull: true} },
        { name: "value_double", value: longValueTypes.includes(type) ? { stringValue: key } : { isNull: true } }
      ]);

      const getResourceSQL = `SELECT * FROM \`resources\` WHERE slug = :slug`;
  
      const foundResource = await db.executeStatement(getResourceSQL, [
        { name: "slug", value: { stringValue: name } },
      ]);

      return foundResource.records.map(
        ([
          { longValue: id },
          { stringValue: slug },
          { stringValue: type },
          { stringValue: value_string },
          { stringValue: value_long_string},
          { longValue: value_double}
        ]) => ({
          id,
          slug,
          type,
          value_string,
          value_long_string,
          value_double
        })
      );
    
    } else {
      throw new Error("resource name already exist");
    }
  }

  static async update({ name , key, type }){
    const db = new DB();


    const updateValuesBatchSQL = `UPDATE \`resources\` SET 
    type = :type, 
    value_string = :value_string,
    value_long_string = :value_long_string,
    value_double = value_double
    WHERE slug = :slug
    `;

  const valueParams = [
    { name: "slug", value: { stringValue: name } },
    { name: "type", value: { stringValue: type } },
    { name: "value_string", value: stringTypes.includes(type) ? { stringValue: key } : { isNull: true } },
    { name: "value_long_string", value: longStringTypes.includes(type) ? { stringValue: key } : { isNull: true} },
    { name: "value_double", value: longValueTypes.includes(type) ? { stringValue: key } : { isNull: true } }
  ]

   await db.executeStatement(updateValuesBatchSQL,valueParams);

      // const Params = resource.records.map(
      //   ([
      //     { longValue: id },
      //     { stringValue: slug },
      //     { stringValue: type },
      //     { stringValue: value_string },
      //     { stringValue: long_value_string },
      //     { longValue: value_double },
      //   ]) => [
      //     { name: "id", value: { longValue: id } },
      //     { name: "slug", value: { stringValue: slug } },
      //     { name: "type", value: { stringValue: type } },
      //     {
      //       name: "value_string",
      //       value: stringTypes.includes(type)
      //         ? { stringValue: value_string }
      //         : { isNull: true },
      //     },
      //     {
      //       name: "long_value_string",
      //       value: longStringTypes.includes(type)
      //         ? { stringValue: long_value_string }
      //         : { isNull: true },
      //     },
      //     {
      //       name: "value_double",
      //       value: longValueTypes.includes(type)
      //         ? { stringValue: value_double }
      //         : { isNull: true },
      //     },
      //   ]
      // );
  }

  static async delete({ slug }){

    const db = new DB();
    const deleteResourceSQL = 'DELETE from \`resources\` where slug = :slug'

    const executeStatementParam = [
      {name: 'slug', value:{stringValue: slug}}
    ]
    await db.executeStatement(deleteResourceSQL, executeStatementParam);
}
}

export default Resource;
