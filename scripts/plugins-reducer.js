//Since this is run outside Next.js, it is best to
//skip the fancy ES6+ stuff. Let's be conservative.


(async() => {

  const {readFile} = require('fs/promises');


  const mode = process.argv[2];
  const pluginDescriptors = process.argv.slice(3);
  //console.log(`Mode: ${mode}`);

  //console.log(pluginDescriptors);
  const reducedPlugins = {plugins: []};
  const output = {};

  const promises = pluginDescriptors.map(async pluginDescriptor =>  {
    const data = await readFile(pluginDescriptor, 'utf8');   
    reducedPlugins.plugins.push(JSON.parse(data)); 
    //console.log(data);
  });

  await Promise.all(promises);

  //console.log(reducedPlugins);

  switch(mode) {

    case 'plugin-menus':
      output.menus = reducedPlugins.plugins.reduce((collector, item) => ([...collector, ...item.menus]), []);
      console.log(JSON.stringify(output));
      break;

  }
  
})();
