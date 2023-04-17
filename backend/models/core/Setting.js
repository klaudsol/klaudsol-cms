import DB from '@klaudsol/commons/lib/DB';

class Resource {
  static async get({ slug }) {
    const db = new DB();
    const getSettingSQL = `SELECT * FROM \`settings\` WHERE \`key\` = :key LIMIT 1`;

    const resource = await db.executeStatement(getSettingSQL, [
      { name: "key", value: { stringValue: slug } },
    ]);

    return resource.records.map(
      ([{ stringValue: key }, { stringValue: value }]) => ({
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

    const updateValuesBatchSQL = `REPLACE INTO settings(\`key\`, \`value\`) 
    VALUES(:key, :value)
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
      ([{ stringValue: key }, { stringValue: value }]) => ({
        key,
        value,
      })
    );
  }

  static async delete({ slug }) {
    const db = new DB();
    const deleteSettingSQL = "UPDATE settings SET `value` = '' WHERE `key` = :key";
    const params = [ { name: 'key', value: { longValue: { string: slug } } } ];

    await db.executeStatement(deleteSettingSQL, params);
  }
}

export default Resource;
