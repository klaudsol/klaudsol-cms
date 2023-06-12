//Since this is run outside Next.js, it is best to
//skip the fancy ES6+ stuff. Let's be conservative.

const mode = process.argv[2];
const pluginDescriptors = process.argv.slice(3);

const reducedPlugins = {plugins: []};
const output = {};

pluginDescriptors.map(pluginDescriptor =>  {
  const rawData = Buffer.from(pluginDescriptor, 'base64').toString('utf-8');
  const data = JSON.parse(rawData);

  //provide additional data for each descriptor
  data.path = pluginDescriptor;
  reducedPlugins.plugins.push(data); 
});


switch(mode) {

  case 'plugin-menus':
    output.menus = reducedPlugins.plugins.reduce((collector, item) => ([...collector, ...item.menus]), []);
    console.log(JSON.stringify(output));
    break;

  case 'info':
    console.log(JSON.stringify(reducedPlugins, null, "  "));
    break;



}
