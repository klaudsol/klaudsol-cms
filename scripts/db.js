const {default: DB} = require('@klaudsol/commons/lib/DB');

let buffer = '';

process.stdin.on('data', data => {
  buffer += data;
});

process.stdin.on('end', () => {

  (async() => {
    const db = new DB();
    const statements = buffer.split(';');

    for(let i = 0; i < statements.length; i++) {

      const statement = statements[i];
      if(!statement.trim()) continue;

      const result = await db.executeStatement(statement);
      console.error(statement);
      console.error(result);
    }


  })();

});


