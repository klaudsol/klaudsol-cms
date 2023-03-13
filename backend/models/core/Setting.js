import DB from '@klaudsol/commons/lib/DB';

class Resource {
  static async get({ slug }) {
    const db = new DB();
    const getSettingSQL = `SELECT * FROM \`settings\` WHERE \`key\` = :key`;

    const resource = await db.executeStatement(getSettingSQL, [
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
    const getSettingSQL = `SELECT * FROM settings WHERE \`key\` = :key`;

    const resource = await db.executeStatement(getSettingSQL, [
      { name: "key", value: { stringValue: key } },
    ]);

    if (!resource.records.length) {
      const insertSettingSQL =
        "INSERT into settings (`key`, `value`) VALUES (:key, :value)";

      await db.executeStatement(insertSettingSQL, [
        { name: "key", value: { stringValue: key } },
        { name: "value", value: { stringValue: value } },
      ]);

      const getSettingSQL = `SELECT * FROM settings WHERE \`key\` = :key`;

      const foundResource = await db.executeStatement(getSettingSQL, [
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

    const updateValuesBatchSQL = `UPDATE settings SET 
    value = :value 
    WHERE \`key\` = :key
    `;

    const valueParams = [
      { name: "key", value: { stringValue: key } },
      { name: "value", value: { stringValue: value } },
    ];
    await db.executeStatement(updateValuesBatchSQL, valueParams);

    const getSettingSQL = `SELECT * FROM \`settings\` WHERE \`key\` = :key`;
    const updatedResource = await db.executeStatement(getSettingSQL, [
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
    const deleteSettingSQL = "DELETE from settings where `key` = :key";

    const executeStatementParam = [
      { name: "key", value: { stringValue: slug } },
    ];
    await db.executeStatement(deleteSettingSQL, executeStatementParam);
  }
}

export default Resource;
