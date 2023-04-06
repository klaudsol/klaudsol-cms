let buffer = '';


const parse = (text) => ( 
  JSON.parse(Buffer.from(text, 'base64').toString('utf-8'))
);

const main = (buffer) => {
  //Input over stream:
  //acc64 - base64-encoded content of the accumulator JSON object
  //current64 - base4-encoded content of the migration
  //filename64 - base64-encoded filename of the migration

  const [acc64, current64, filename64] = buffer.split(" ");
  
  const accumulator = parse(acc64);
  const current = parse(current64);
  const filename = parse(filename64);
  const output = {
    data: [
      ...accumulator.data,
      {
        ...current,
        name: filename.filename.trim() 
      }
    ]
  }
  return JSON.stringify(output);
  
};

process.stdin.on('data', data => {
  buffer += data;
});

process.stdin.on('end', () => {

  process.stdout.write(main(buffer));

});