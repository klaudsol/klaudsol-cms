import Trucking from './trucking';


const AppRegistry = [
  Trucking    
];

const dashboardRoot = '/dashboard/apps';

export const indexedAppRegistry = Object.fromEntries(AppRegistry.map((app) => [app.metadata.code, app]));

export const appPath = (app, subPath='') => `${dashboardRoot}/${app.metadata.code}${subPath}`;

export const appBreadcrumbsArray = (app, breadcrumbsArray=[]) => [['Apps' , dashboardRoot], ...(app ? [[app.metadata.name, appPath(app)]] : []), ...breadcrumbsArray];

export default AppRegistry;