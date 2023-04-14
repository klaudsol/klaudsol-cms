//We use this instead of base64 to have a consistent output 
//across Mac and Linux

let buffer = '';

process.stdin.on('data', data => {
  buffer += data;
});

process.stdin.on('end', () => {

  const base64 = Buffer.from(buffer, 'utf-8').toString('base64');
  process.stdout.write(base64);

});