/*import { 
  cilTruck,
  cilSpreadsheet,
  cilDollar,
  cilCopy,
  cilCash,
  cilArrowThickToBottom,
  cilLocationPin
} from '@coreui/icons';
*/
import { CSpinner } from '@coreui/react'
import  { Suspense, lazy } from 'react'
import { appPath, appBreadcrumbsArray } from '@/apps/AppRegistry';
import SMEIcon from '@/lib/sme/SMEIcon';
import SMEIconContainer from '@/lib/sme/SMEIconContainer';
import SMEBreadcrumb from '@/lib/sme/SMEBreadcrumb';

export const PATH_TRIP_TICKET = '/trip_ticket';
export const PATH_COLLECTION = '/collection';
export const PATH_REPORTS = '/reports';
export const PATH_REPORTS_BILLING = '/reports/billing';
export const PATH_LOCATIONS = '/locations';


export const billingCompanies = [
  {id: 1, name: "Ninja Van"},
  {id: 2, name: "PMFTC"},
];

const TripTicket = lazy(() => import('./trip_ticket/TripTicket'));
const Billing = lazy(() => import('./reports/Billing'));
const Locations = lazy(() => import('./locations/Locations'));

const Trucking = () => {
  
  return (
      <Suspense fallback={<CSpinner color="primary" />}>
        <Switch>
          <Route path={appPath(Trucking)} exact={true} render={(props) => (
              <>
              
                <SMEBreadcrumb paths={appBreadcrumbsArray(Trucking)} />
              
    
                <SMEIconContainer>
                
                  {Trucking.menu.map((menu, index) => (
                  
                    <SMEIcon icon={menu.icon}  label={menu.label} key={index} 
                      linkTo={appPath(Trucking, menu.relativePath)} bgColor={menu.bgColor} />
                    
                  ))}
                
                    
                </SMEIconContainer>
              </>
            )}
          />
          <Route path={appPath(Trucking, PATH_TRIP_TICKET)} exact={true} render={(props) => <TripTicket {...props} /> } />
          <Route path={appPath(Trucking, PATH_COLLECTION)} exact={true} render={(props) => <h1>Collection</h1>}/>
          
          
          <Route path={appPath(Trucking, PATH_REPORTS)} exact={true} render={(props) => (
              <>
                <SMEBreadcrumb paths={appBreadcrumbsArray(Trucking, [["Reports", '']])} />
                
                <SMEIconContainer>
                    {/*
                    <SMEIcon icon={cilDollar}  label="Billing" 
                      linkTo={appPath(Trucking, PATH_REPORTS_BILLING)} bgColor='#116530' />
                    <SMEIcon icon={cilArrowThickToBottom}  label="Collectible" 
                      linkTo={appPath(Trucking, '/billing_report')} bgColor='#18A558' />
                      */}
                </SMEIconContainer>
              </>
            )}
          />
          
          <Route path={appPath(Trucking, PATH_REPORTS_BILLING)} exact={true} render={(props) => <Billing {...props} />} />
          <Route path={appPath(Trucking, PATH_LOCATIONS)} exact={true} render={(props) => <Locations {...props} />}/>
          
          
        </Switch>
      </Suspense>
  );  
}

Trucking.metadata = {
  name: "Trucking",
  code: "trucking",
  icon_type: "coreui",
  icon_class_name: "bg-danger",
  icon_color: null,
  //icon: cilTruck,
  code_ready: true
}

Trucking.menu = [
  {label: "Trip Ticket",  relativePath: PATH_TRIP_TICKET, /*icon: cilSpreadsheet,*/ bgColor: '#2094B9'},
  {label: "Collection",  relativePath: PATH_COLLECTION, /*icon: cilCash,*/ bgColor: '#59981A'},
  {label: "Reports",  relativePath: PATH_REPORTS, /*icon: cilCopy,*/ bgColor: '#555955'},
  {label: "Locations",  relativePath: PATH_LOCATIONS,/*icon: cilLocationPin,*/ bgColor: '#A62424'},
];

export default Trucking;