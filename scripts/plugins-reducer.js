//Since this is run outside Next.js, it is best to
//skip the fancy ES6+ stuff. Let's be conservative.


(async() => {

  const {readFile} = require('fs/promises');


  const mode = process.argv[2];
  const pluginDescriptors = process.argv.slice(3);

  const reducedPlugins = {plugins: []};
  const output = {};

  const promises = pluginDescriptors.map(async pluginDescriptor =>  {
    const rawData = await readFile(pluginDescriptor, 'utf8');   
    const data = JSON.parse(rawData);
    //provide additional data for each descriptor
    data.path = pluginDescriptor;
    reducedPlugins.plugins.push(data); 
  });

  await Promise.all(promises);


  switch(mode) {

    case 'plugin-menus':
      output.menus = reducedPlugins.plugins.reduce((collector, item) => ([...collector, ...item.menus]), []);
      console.log(JSON.stringify(output));
      break;

    case 'info':
      console.log(JSON.stringify(reducedPlugins, null, "  "));
      break;



  }
  
})();
