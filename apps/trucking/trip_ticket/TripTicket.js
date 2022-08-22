
import SMESmartTable, {
  DEFAULT_EDIT_ROW_ACTION, DEFAULT_DELETE_ROW_ACTION, 
  DEFAULT_UPDATE_SAVE_ROW_ACTION, DEFAULT_UPDATE_CANCEL_ROW_ACTION,
  DEFAULT_ADD_FORM_ACTION 
} from '@/lib/sme/SMESmartTable';
import { useReducer, useEffect, createContext } from 'react';
import { useIndex, slsFetch } from '@/components/Util';
import { appBreadcrumbsArray } from '@/apps/AppRegistry';
import Trucking, { billingCompanies } from '@/apps/trucking/Trucking';
import SMEBreadcrumb from '@/lib/sme/SMEBreadcrumb';
import SMESessionChecker from '@/lib/sme/SMESessionChecker';
import SMESkeleton from '@/lib/sme/SMESkeleton';
import {formatISODateToDisplay} from '@/lib/sme/SMECalendar';
import { CRow } from '@coreui/react';
import { backendPath, displayCurrency } from '@/components/GlobalConstants';

export const TripTicketContext = createContext();




const warehouses = [
  {id: 1, name: "Batangas"},
  {id: 2, name: "Cabuyao - WH2"},
];

const destinations = [
  {id: 1, name: "Mindoro"},
  {id: 2, name: "Bayombong"},
  {id: 3, name: "Gumaca"},
  {id: 4, name: "San Pedro - Lazada WH"}
];

const drivers = [
  {id: 1, name: "A"},
  {id: 2, name: "B"},
];

const helpers = [
  {id: 1, name: "A"},
  {id: 2, name: "B"},
];

const plateNos = [
  {id: 1, name: "XXX 123"},
];


const TripTicket = (props) => {
  
  const indexedWarehouse = useIndex(warehouses);
  const indexedDestinations = useIndex(destinations);
  const indexedDrivers = useIndex(drivers);
  const indexedHelpers = useIndex(helpers);
  const indexedPlateNos = useIndex(plateNos);
  const indexedBillingCompanies = useIndex(billingCompanies);
  
  const initialState = {
    data: [],
    trip_tickets_loading: true,
    trip_tickets_add_loading: false
  };
  
  
  const reducer = (state, action) => {
    
    switch(action.type) {
      
      case 'ADD_TRIP_TICKET':
        return {
          ...state, 
          data: [action.value,  ...state.data ]};
      case 'UPDATE_TRIP_TICKET':
        return {
          ...state, 
          data: state.data.map((row) => row.id === action.value.id ? action.value : row )
        };
      case 'SET_TRIP_TICKETS':
        return {
          ...state, 
          data: action.value, 
          trip_tickets_loading: false
        };
      case 'SET_TRIP_TICKETS_ADD_LOADING':
        return {
          ...state,
          trip_tickets_add_loading: action.value
        };
      case 'DELETE_TRIP_TICKET':
        return {
          ...state,
          data: state.data.filter(row => row.id !== action.value)
        }  
      case 'RESET':
        return {
          ...initialState, 
          data: state.data,
          trip_tickets_loading: false
        };
      default:
        throw new Error('Invalid Action Type');
      
    }
    
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const priceMatrix = {
    1: {1: 18000},
    2: {
      2: 16700,
      3: 9000,
      4: 4500,
      1: 18000
    }
  };
  
  const addFormAction = (form, rowEffects, formEffects) =>  {
    (async () => {
      try {
        
        
        dispatch({type: 'SET_TRIP_TICKETS_ADD_LOADING', value: true});
        const result = await slsFetch(backendPath('/apps/trucking/trip_tickets.json'), {
          method: 'POST',  
          headers: {
            'Content-type': 'application/json'
          },
          //pass currency value in POST API in non-serialized form,i
          //the API would serialize it automatically
          body: JSON.stringify(form)
        }); 
        const resultJSON = await result.json();
        
        //console.error(resultJSON);
        
        //for in-memory storage however, we need to serialize it manually,
        //as there is no API to do it for us.
        const rowId = resultJSON.id
        dispatch({type: 'ADD_TRIP_TICKET',  value: {id: rowId , ...form}});
        rowEffects.fadeIn(rowId);
        dispatch({type: 'SET_TRIP_TICKETS_ADD_LOADING', value: false});
        formEffects.resetAddForm();
        rowEffects.resetEditMode();
        
      } catch (ex) {
        console.error(ex);  
      }
        
    })();
  };
  
  const deleteRowAction = (row, rowEffects) =>  {
    if(window.confirm("Are you sure you want to delete this row?")) {
      (async () => {
        const result = await slsFetch(backendPath(`/apps/trucking/trip_tickets/${row.id}.json`), {
          method: 'DELETE',  
          headers: {
            'Content-type': 'application/json'
          }
        }); 
        const resultJSON = await result.json();
        if(resultJSON.success) {
          rowEffects.fadeOut(row.id);
          setTimeout(() => dispatch({type: 'DELETE_TRIP_TICKET', value: row.id}), 500);    
        }
      })();
    }
  };
  
  
  //TODO: Refactored away to SMESmartTable, 
  const editRowAction = (row, rowEffects) => {
    rowEffects.editMode(row.id, true);
    rowEffects.fadeIn(row.id);  
  };
  
  //TODO: Refactored away to SMESmartTable, 
  const updateCancelRowAction = (row, rowEffects) => {
    rowEffects.editMode(row.id, false);
    rowEffects.fadeIn(row.id);  
  };
  
  const updateSaveRowAction = (row, rowEffects) => {
    (async () => {
      try {
        
        await slsFetch(backendPath(`/apps/trucking/trip_tickets/${row.id}.json`), {
          method: 'PUT',  
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(row)
        }); 
        
        dispatch({type: 'UPDATE_TRIP_TICKET', value: row});
        rowEffects.editMode(row.id, false);
        rowEffects.fadeIn(row.id);
        
      } catch (error) {
        
      } finally {
        
      }
    })();
  };
  
  useEffect(() => {
    
    (async () => {
      const data = await slsFetch(backendPath('/apps/trucking/trip_tickets.json'));
      const dataJson = await data.json();
      dispatch({
        type: 'SET_TRIP_TICKETS', 
        value: dataJson.trip_tickets 
      }); 
    })();
    
  }, []);
  
  useEffect(() => {
    //console.log(state.data);  
  }, [state.data]);
  
  
  return (
    <SMESessionChecker>
      {(loading) => { 
      
      const tableLoading = loading || state.trip_tickets_loading;
      
      return (
      
        <TripTicketContext.Provider value={[state, dispatch]}>
        
          <SMEBreadcrumb paths={appBreadcrumbsArray(Trucking, [["Trip Ticket", '']])} loading={loading} />
          
          <CRow className='mb-3'>
            <SMESkeleton loading={loading} block={true} blockStyle={{'marginLeft': '12px', width: '250px'}}>
              <h1>Trip Ticket</h1>
            </SMESkeleton>
            
            <SMESmartTable 
              columns={[
                { 
                  name: 'date', 
                  header: "Date", 
                  type: "date", 
                  display: (value) => formatISODateToDisplay(value),
                  formSerializer: (value) => value
                },
                {
                  name: 'serial_number',
                  header: "Serial Number", 
                  type: "text", 
                },
                {
                  name: 'trucking_source_id',
                  header: "Source", 
                  type: "dropdown", 
                  display: (value) => indexedWarehouse[value]?.name,
                  options: warehouses.map((warehouse) => <option value={warehouse.id} key={warehouse.id}>{warehouse.name}</option>),
                  includeAdd: false,
                  placeholder: "Select source...",
                  formOnChange: (evt, oldForm, effects) => evt.target.value && 
                    oldForm.trucking_destination_id && effects.setForm('price', `${priceMatrix[evt.target.value][oldForm.trucking_destination_id] ?? ''}`)  
                },
                {
                  name: 'trucking_destination_id',
                  header: "Destination", 
                  type: "dropdown", 
                  display: (value) => indexedDestinations[value]?.name,
                  options: destinations.map((d) => <option value={d.id} key={d.name}>{d.name}</option>),
                  includeAdd: false,
                  placeholder: "Select destination...",
                  formOnChange: (evt, oldForm, effects) => evt.target.value && 
                    oldForm.trucking_source_id && effects.setForm('price', `${priceMatrix[oldForm.trucking_source_id][evt.target.value] ?? ''}`)  
                },
                {
                  name: 'price',
                  header: "Price", 
                  type: "static", 
                  display: (value) => value ? displayCurrency(value) : '-',
                },
                {
                  name: 'trucking_driver_id',
                  header: "Driver", 
                  type: "dropdown", 
                  display: (value) => indexedDrivers[value]?.name,
                  options: drivers.map((driver) => <option value={driver.id} key={driver.name}>{driver.name}</option>),
                  includeAdd: false,
                  placeholder: "Select driver..."
                  
                }, 
                {
                  name: 'trucking_driver_helper_id',
                  header: "Helper", 
                  type: "dropdown", 
                  display: (value) => indexedHelpers[value]?.name,
                  options: helpers.map((helper) => <option value={helper.id} key={helper.name}>{helper.name}</option>),
                  includeAdd: false,
                  placeholder: "Select helper..."
                },
                {
                  name: 'trucking_truck_id',
                  header: "Truck Plate No.", 
                  type: "dropdown", 
                  display: (value) => indexedPlateNos[value]?.name,
                  options: plateNos.map((plateNo) => <option value={plateNo.id} key={plateNo.name}>{plateNo.name}</option>),
                  includeAdd: false,
                  placeholder: "Select plate no..."
                },
                {
                  name: 'sme_customer_id',
                  header: "Billing Company", 
                  type: "dropdown", 
                  display: (value) => indexedBillingCompanies[value]?.name,
                  options: billingCompanies.map((billingCompany) => <option value={billingCompany.id} key={billingCompany.name}>{billingCompany.name}</option>),
                  includeAdd: false,
                  placeholder: "Select billing company..."
                },
              ]}
              data={state.data}
              formActions={[
                {...DEFAULT_ADD_FORM_ACTION, action: (form, rowEffects, formEffects) => addFormAction(form,rowEffects, formEffects), loading: state.trip_tickets_add_loading}
              ]}
              rowActions={[
                {...DEFAULT_EDIT_ROW_ACTION, action: (row, rowEffects) => editRowAction(row, rowEffects)}, 
                {...DEFAULT_DELETE_ROW_ACTION, action: (row, rowEffects) => deleteRowAction(row, rowEffects)},
                {...DEFAULT_UPDATE_SAVE_ROW_ACTION, action: (row, rowEffects) => updateSaveRowAction(row, rowEffects)},
                {...DEFAULT_UPDATE_CANCEL_ROW_ACTION, action: (row, rowEffects) => updateCancelRowAction(row, rowEffects)}
              ]}
              loading={tableLoading}
              />
          </CRow>
        </TripTicketContext.Provider>
      )}}
    </SMESessionChecker>
    );
}

export default TripTicket;