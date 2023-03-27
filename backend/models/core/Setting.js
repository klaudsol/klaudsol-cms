import DB from "@klaudsol/commons/lib/DB";

class Resource {
  static async get() {
    const db = new DB();
    const sql = `SELECT * FROM \`settings\``;

    const data = await db.executeStatement(sql);
    const output = data.records.map(
      ([
        { longValue: id },
        { stringValue: setting },
        { stringValue: value },
      ]) => ({
        id,
        setting,
        value,
      })
    );

    return output;
  }

  static async getLogo() {
    const db = new DB();
    const sql = `SELECT * FROM settings WHERE setting = "mainlogo"`;

    const data = await db.executeStatement(sql);
    const output = data.records.map(
      ([
        { longValue: id },
        { stringValue: setting },
        { stringValue: value },
      ]) => ({
        id,
        setting,
        value,
      })
    );

    return output;
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

  static async update(entry) {
    const db = new DB();

    const sql = `
        UPDATE settings SET value = :value 
        WHERE \`setting\` = :setting
    `;

    const valueParams = Object.keys(entry).map((e) => [
        { name: 'setting', value: { stringValue: e }},
        { name: 'value', value: { stringValue: entry[e] }}
    ])

    await db.batchExecuteStatement(sql, valueParams);

    return true;
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
