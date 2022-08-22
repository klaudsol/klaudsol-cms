import SMESessionChecker from '@/lib/sme/SMESessionChecker';
import { appBreadcrumbsArray } from '@/apps/AppRegistry';
import Trucking from '@/apps/trucking/Trucking';
import SMEBreadcrumb from '@/lib/sme/SMEBreadcrumb';
import SMESkeleton from '@/lib/sme/SMESkeleton';
import { CRow } from '@coreui/react';
import SMESmartTable, {
  DEFAULT_EDIT_ROW_ACTION, DEFAULT_DELETE_ROW_ACTION, 
  DEFAULT_UPDATE_SAVE_ROW_ACTION, DEFAULT_UPDATE_CANCEL_ROW_ACTION,
  DEFAULT_ADD_FORM_ACTION
} from '@/lib/sme/SMESmartTable';
import { useEffect, useReducer } from 'react';
import { backendPath } from '@/components/GlobalConstants';
import { slsFetch } from '@/components/Util';


/*
const sources = [
  {id: 1, name: "Batangas"},
  {id: 2, name: "Cabuyao - WH2"},
];

const destinations = [
  {id: 1, name: "Mindoro"},
  {id: 2, name: "Bayombong"},
  {id: 3, name: "Gumaca"},
  {id: 4, name: "San Pedro - Lazada WH"}
];
*/

/*
const priceMatrix = {
  1: {1: 18000},
  2: {
    2: 16700,
    3: 9000,
    4: 4500,
    1: 18000
  }
};
*/


const Locations = () => {
  
  const initialState = {
    data: []
  };
  
  const reducer = (state, action) => {
    
    switch(action.type) {
      
      case 'SET_LOCATIONS':
        return {
          ...state, 
          data: action.value, 
        };
      default:
        throw new Error('Invalid Action Type');
      
    }
    
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  
  
  useEffect(() => {
    
    (async () => {
      const data = await slsFetch(backendPath('/apps/trucking/locations.json'));
      const dataJson = await data.json();
      console.error(dataJson);
      dispatch({
        type: 'SET_LOCATIONS', 
        value: dataJson.locations 
      }); 
    })();
    
  }, []);
  
  return (
    
    <SMESessionChecker>
      {(loading) => { 
        
        return (
          <>
            <SMEBreadcrumb paths={appBreadcrumbsArray(Trucking, [["Locations", '']])} loading={loading} />
            <CRow className='mb-3'>
              <SMESkeleton loading={loading} block={true} blockStyle={{'marginLeft': '12px', width: '250px'}}>
                <h1>Locations</h1>
              </SMESkeleton>
              
              <SMESmartTable 
                columns={[
                  {
                    name: 'name',
                    header: "Locations", 
                    type: "text", 
                  }]}
                data={state.data}
                
                formActions={[
                  {...DEFAULT_ADD_FORM_ACTION } 
                ]}
                rowActions={[
                  {...DEFAULT_EDIT_ROW_ACTION }, 
                  {...DEFAULT_DELETE_ROW_ACTION },
                  {...DEFAULT_UPDATE_SAVE_ROW_ACTION },
                  {...DEFAULT_UPDATE_CANCEL_ROW_ACTION }
                ]}
                loading={loading}
              />
              
            </CRow>
          </>
        )
      }}
    </SMESessionChecker>
  );
    
}
export default Locations;