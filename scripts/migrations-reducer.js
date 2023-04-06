let buffer = '';


const parse = (text) => ( 
  JSON.parse(Buffer.from(text, 'base64').toString('utf-8'))
);

const main = (buffer) => {
  //Input over stream:
  //acc64 - base64-encoded content of the accumulator JSON object
  //current4 - base4-encoded content of the migration
  //filename - plaintext filename of the migration

  const [acc64, current64, filename] = buffer.split(" ");
  
  const accumulator = parse(acc64);
  //console.error(accumulator);
  const current = parse(current64);
  const output = {
    data: [
      ...accumulator.data,
      {
        ...current,
        name: filename.trim() 
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