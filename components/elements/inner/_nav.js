import React from 'react'
import CIcon from '@coreui/icons-react'
/*
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilApplications,
  cilCode,
  //cilTruck,
  cilMoney,
  cilList,
  cilGlobeAlt,
  cilBlur,
} from '@coreui/icons';
*/
import { CNavGroup, CNavItem } from '@coreui/react'
import AppRegistry, { appPath } from '@/apps/AppRegistry';

const routePrefix = '/dashboard';
const appPrefix = `${routePrefix}/apps`;

const sampleAppsNav = [
  {
    component: CNavItem,
    name: 'Payroll',
    to: `${appPrefix}/payroll`,
    //icon: <CIcon icon={cilMoney} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: `${appPrefix}/inventory`,
    //icon: <CIcon icon={cilList} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'eCommerce',
    to: `${appPrefix}/ecommerce`,
    //icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />
  },
]

const appsNav = AppRegistry.map((app) => {
  
  let appNavEntry =  {
    component: app.menu.length > 0 ? CNavGroup : CNavItem,
    name: app.metadata.name,
    to: appPath(app),
    //icon: <CIcon icon={app.metadata.icon} customClassName="nav-icon" /> 
  };
  
  let items = []; 
  
  if (app.menu && app.menu.length > 0) {
    items = app.menu.map((menu) => ({
      component: CNavItem,
      name: menu.label,
      to: appPath(app, menu.relativePath),
      //icon: <CIcon icon={menu.icon} customClassName="nav-icon" /> 
    }));  
    
    //Add app dashboard
    items = [{
      component: CNavItem,
      name: `${app.metadata.name} Main`,
      to: appPath(app),
      //icon: <CIcon icon={cilBlur} customClassName="nav-icon" /> 
      
    }, ...items];
  }
  
  //CoreUI does not allow empty items entry.
  if(items.length > 0) appNavEntry = {...appNavEntry, items};
  return appNavEntry;
  
});

const smeNav = [
  {
    component: CNavItem,
    name: 'Apps',
    to: `${routePrefix}/apps`,
    //icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  }
];

const demoRoutePrefix =  `${routePrefix}/demo`;
const demoNav = [
  {
    component: CNavGroup,
    name: 'Demo',
   //icon: <CIcon icon={cilCode} customClassName="nav-icon" />,
    items: [
        {
          component: CNavItem,
          name: 'Dashboard',
          to: `${demoRoutePrefix}/dashboard`,
          //icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
          badge: {
            color: 'info',
            text: 'NEW',
          },
        },
        {
          component: CNavItem,
          name: 'Colors',
          to: `${demoRoutePrefix}/theme/colors`,
          //icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Typography',
          to: `${demoRoutePrefix}/theme/typography`,
          //icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
        },
        {
          component: CNavGroup,
          name: 'Base',
          to: `${demoRoutePrefix}/base`,
          //icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Accordion',
              to: `${demoRoutePrefix}/base/accordion`,
            },
            {
              component: CNavItem,
              name: 'Breadcrumb',
              to: `${demoRoutePrefix}/base/breadcrumbs`,
            },
            {
              component: CNavItem,
              name: 'Cards',
              to: `${demoRoutePrefix}/base/cards`,
            },
            {
              component: CNavItem,
              name: 'Carousel',
              to: `${demoRoutePrefix}/base/carousels`,
            },
            {
              component: CNavItem,
              name: 'Collapse',
              to: `${demoRoutePrefix}/base/collapses`,
            },
            {
              component: CNavItem,
              name: 'List group',
              to: `${demoRoutePrefix}/base/list-groups`,
            },
            {
              component: CNavItem,
              name: 'Navs & Tabs',
              to: `${demoRoutePrefix}/base/navs`,
            },
            {
              component: CNavItem,
              name: 'Pagination',
              to: `${demoRoutePrefix}/base/paginations`,
            },
            {
              component: CNavItem,
              name: 'Popovers',
              to: `${demoRoutePrefix}/base/popovers`,
            },
            {
              component: CNavItem,
              name: 'Progress',
              to: `${demoRoutePrefix}/base/progress`,
            },
            {
              component: CNavItem,
              name: 'Spinners',
              to: `${demoRoutePrefix}/base/spinners`,
            },
            {
              component: CNavItem,
              name: 'Tables',
              to: `${demoRoutePrefix}/base/tables`,
            },
            {
              component: CNavItem,
              name: 'Tooltips',
              to: `${demoRoutePrefix}/base/tooltips`,
            },
          ],
        },
        {
          component: CNavGroup,
          name: 'Buttons',
          to: `${demoRoutePrefix}/buttons`,
          //icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Buttons',
              to: `${demoRoutePrefix}/buttons/buttons`,
            },
            {
              component: CNavItem,
              name: 'Buttons groups',
              to: `${demoRoutePrefix}/buttons/button-groups`,
            },
            {
              component: CNavItem,
              name: 'Dropdowns',
              to: `${demoRoutePrefix}/buttons/dropdowns`,
            },
          ],
        },
        
        {
          component: CNavGroup,
          name: 'Forms',
          //icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Form Control',
              to: `${demoRoutePrefix}/forms/form-control`,
            },
            {
              component: CNavItem,
              name: 'Select',
              to: `${demoRoutePrefix}/forms/select`,
            },
            {
              component: CNavItem,
              name: 'Checks & Radios',
              to: `${demoRoutePrefix}/forms/checks-radios`,
            },
            {
              component: CNavItem,
              name: 'Range',
              to: `${demoRoutePrefix}/forms/range`,
            },
            {
              component: CNavItem,
              name: 'Input Group',
              to: `${demoRoutePrefix}/forms/input-group`,
            },
            {
              component: CNavItem,
              name: 'Floating Labels',
              to: `${demoRoutePrefix}/forms/floating-labels`,
            },
            {
              component: CNavItem,
              name: 'Layout',
              to: `${demoRoutePrefix}/forms/layout`,
            },
            {
              component: CNavItem,
              name: 'Validation',
              to: `${demoRoutePrefix}/forms/validation`,
            },
          ],
        },
        {
          component: CNavItem,
          name: 'Charts',
          to: `${demoRoutePrefix}/charts`,
          //icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
        },
        {
          component: CNavGroup,
          name: 'Icons',
          //icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'CoreUI Free',
              to: `${demoRoutePrefix}/icons/coreui-icons`,
              badge: {
                color: 'success',
                text: 'NEW',
              },
            },
            {
              component: CNavItem,
              name: 'CoreUI Flags',
              to: `${demoRoutePrefix}/icons/flags`,
            },
            {
              component: CNavItem,
              name: 'CoreUI Brands',
              to: `${demoRoutePrefix}/icons/brands`,
            },
          ],
        },
        {
          component: CNavGroup,
          name: 'Notifications',
          //icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Alerts',
              to: `${demoRoutePrefix}/notifications/alerts`,
            },
            {
              component: CNavItem,
              name: 'Badges',
              to: `${demoRoutePrefix}/notifications/badges`,
            },
            {
              component: CNavItem,
              name: 'Modal',
              to: `${demoRoutePrefix}/notifications/modals`,
            },
            {
              component: CNavItem,
              name: 'Toasts',
              to: `${demoRoutePrefix}/notifications/toasts`,
            },
          ],
        },
        {
          component: CNavItem,
          name: 'Widgets',
          to: `${demoRoutePrefix}/widgets`,
          //icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
          badge: {
            color: 'info',
            text: 'NEW',
          },
        },
      /*  {
          component: CNavTitle,
          name: 'Extras',
        },
        {
          component: CNavGroup,
          name: 'Pages',
          icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Login',
              to: `${demoRoutePrefix}/login`,
            },
            {
              component: CNavItem,
              name: 'Register',
              to: `${demoRoutePrefix}/register`,
            },
            {
              component: CNavItem,
              name: 'Error 404',
              to: `${demoRoutePrefix}/404`,
            },
            {
              component: CNavItem,
              name: 'Error 500',
              to: `${demoRoutePrefix}/500`,
            },
          ],
        },
      */
            ]
        },
      /*  {
          component: CNavTitle,
          name: 'Components',
        },
      */
]

//const _nav = [...smeNav, ...appsNav, ...sampleAppsNav, ...(!process.env.REACT_APP_PRODUCTION ? demoNav : [])];

const _nav = [];

export default _nav
