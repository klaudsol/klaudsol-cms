import DB from "@backend/data_access/DB";

class Resource {
  static async get({ slug }) {
    const db = new DB();
    const getResourceSQL = `SELECT * FROM \`resources\` WHERE \`key\` = :key`;

    const resource = await db.executeStatement(getResourceSQL, [
      { name: "key", value: { stringValue: slug } },
    ]);

    return resource.records.map(
      ([{ longValue: id }, { stringValue: key }, { stringValue: value }]) => ({
        id,
        key,
        value,
      })
    );
  }

  static async create({ key, value }) {
    const db = new DB();
    const getResourceSQL = `SELECT * FROM resources WHERE \`key\` = :key`;

    const resource = await db.executeStatement(getResourceSQL, [
      { name: "key", value: { stringValue: key } },
    ]);

    if (!resource.records.length) {
      const insertResourceSQL =
        "INSERT into resources (`key`, `value`) VALUES (:key, :value)";

      await db.executeStatement(insertResourceSQL, [
        { name: "key", value: { stringValue: key } },
        { name: "value", value: { stringValue: value } },
      ]);

      const getResourceSQL = `SELECT * FROM resources WHERE \`key\` = :key`;

      const foundResource = await db.executeStatement(getResourceSQL, [
        { name: "key", value: { stringValue: key } },
      ]);

      return foundResource.records.map(
        ([
          { longValue: id },
          { stringValue: key },
          { stringValue: value },
        ]) => ({
          id,
          key,
          value,
        })
      );
    } else {
      throw new Error("resource name already exist");
    }
  }

  static async update({ key, value }) {
    const db = new DB();

    const updateValuesBatchSQL = `UPDATE resources SET 
    value = :value 
    WHERE \`key\` = :key
    `;

    const valueParams = [
      { name: "key", value: { stringValue: key } },
      { name: "value", value: { stringValue: value } },
    ];
    await db.executeStatement(updateValuesBatchSQL, valueParams);

    const getResourceSQL = `SELECT * FROM \`resources\` WHERE \`key\` = :key`;
    const updatedResource = await db.executeStatement(getResourceSQL, [
      { name: "key", value: { stringValue: key } },
    ]);

    return updatedResource.records.map(
      ([{ longValue: id }, { stringValue: key }, { stringValue: value }]) => ({
        id,
        key,
        value,
      })
    );
  }

  static async delete({ slug }) {
    const db = new DB();
    const deleteResourceSQL = "DELETE from resources where `key` = :key";

    const executeStatementParam = [
      { name: "key", value: { stringValue: slug } },
    ];
    await db.executeStatement(deleteResourceSQL, executeStatementParam);
  }
}

export default Resource;
