const {default: DB} = require('@klaudsol/commons/lib/DB');

let buffer = '';

const main = async (buffer) => {
  const reducedMigrations = JSON.parse(buffer);
  for(let i = 0; i < reducedMigrations.data.length; i++) {
    console.log(reducedMigrations.data[i].name);
    console.log(reducedMigrations.data[i].up);
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