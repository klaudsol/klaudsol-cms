const {default: DB} = require('@klaudsol/commons/lib/DB');

let buffer = '';

const main = async (buffer) => {
  const db = new DB();
  const reducedMigrations = JSON.parse(buffer);
  for(let i = 0; i < reducedMigrations.data.length; i++) {
    let commandUp =reducedMigrations.data[i].up; 
    console.error(reducedMigrations.data[i].name);
    if(Array.isArray(commandUp)) commandUp = commandUp.join('')
    console.error(">>>SQL:");
    console.error(commandUp);
    const result = await db.executeStatement(commandUp);
    console.error(">>>RESULT:");
    console.error(JSON.stringify(result));
    console.error("\n");
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