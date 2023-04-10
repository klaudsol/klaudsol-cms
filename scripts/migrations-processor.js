const {default: DB} = require('@klaudsol/commons/lib/DB');

let buffer = '';

const main = async (buffer) => {
  const db = new DB();
  const existingMigrations = await db.executeStatement("SELECT name FROM migrations ORDER by created_at");
  const existingMigrationRecords = existingMigrations.records.map(record => record[0]?.stringValue);
  const reducedMigrations = JSON.parse(buffer);
  for(let i = 0; i < reducedMigrations.data.length; i++) {
    let commandUp =reducedMigrations.data[i].up; 
    const name = reducedMigrations.data[i].name;

    if(existingMigrationRecords.includes(name)) {
      console.error(`Skipping ${name}...`);
      continue;
    };

    console.error(`Executing ${name}...`);
    if(Array.isArray(commandUp)) commandUp = commandUp.join('')
    console.error(">>>SQL:");
    console.error(commandUp);
    const result = await db.executeStatement(commandUp);
    console.error(">>>RESULT:");
    console.error(JSON.stringify(result));
    console.error("\n");

    //Insert into migrations table so that it will not be executed again
    await db.executeStatement("INSERT INTO migrations(name) VALUES(:name)", [
      {name: "name", value: {stringValue: name}}
    ]);
  }
}

process.stdin.on('data', data => {
  buffer += data;
});

process.stdin.on('end', () => {

  (async() => {
    await main(buffer);
  })(); 

});