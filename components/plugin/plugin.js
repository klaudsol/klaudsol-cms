import { pluginMapping } from '@/plugin-exports';


export const plugin = (key) => {

    //TODO: key existence checking and fancy regex stuff can go here
    return pluginMapping[key];

};