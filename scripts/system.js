const {default: DB} = require('@klaudsol/commons/lib/DB');


  (async() => {

    const db = new DB();
    const [_1, _2, method, system_name, system_value] = process.argv;
    let result;
    switch(method) {

      case 'get':
        result = await db.executeStatement("SELECT value FROM system WHERE name = :name", [
          {name: "name", value: {stringValue: system_name}}
        ]);
        console.error(result);
        if (result.records.length > 0) {
          process.stdout.write(result.records[0][0].stringValue);
        } else {
          process.stdout.write('');
        }
        break;
      case 'add':
        result = await db.executeStatement("REPLACE INTO system(name, value) VALUES(:name, :value)", [
          {name: "name", value: {stringValue: system_name}},
          {name: "value", value: {stringValue: system_value}},
        ]);
        break;
      case 'remove':
        result = await db.executeStatement("DELETE FROM system WHERE name = :name", [
          {name: "name", value: {stringValue: system_name}},
        ]);
        break;

    }

  })();

