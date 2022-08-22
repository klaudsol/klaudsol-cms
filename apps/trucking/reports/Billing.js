import SMEBreadcrumb from '@sme/SMEBreadcrumb';
import SMEFormSelect from '@sme/SMEFormSelect';
import SMEText from '@sme/SMEText';
import { appPath, appBreadcrumbsArray } from '@/apps/AppRegistry';
import Trucking, {PATH_REPORTS, billingCompanies} from '@/apps/trucking/Trucking';
import { CRow, CCol, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react';
import SMESmartTable from '@sme/SMESmartTable';
import SMEButton from '@sme/SMEButton';
import SMESessionChecker from '@sme/SMESessionChecker';
import SMECalendar from '@sme/SMECalendar';
import { 
  cilCopy,
  cilTruck,
  cilCloudDownload
} from '@coreui/icons';
import { useReducer } from 'react';

const Billing = () => {
  
  const initialState = {
    inputMode: true,
    reportMode: false
  };
  
  const reducer = (state, action) => {
    
    switch (action.type) {
      
      case 'GENERATE_REPORT':
        return {
          ...state,
          inputMode: false,
          reportMode: true
        }
      default:
        return state;
      
    }
    
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const {inputMode, reportMode } = state;
  
  return (
    <SMESessionChecker>
    
      {(loading) => (
        <>
        
          <SMEBreadcrumb loading={loading} paths={appBreadcrumbsArray(Trucking, [
            ["Reports", appPath(Trucking, PATH_REPORTS)],
            ["Billing", '']
          ])} />
        
          {inputMode &&
          <>
            <CRow className='mb-3'>
              <CCol xs={12} md={2} className='sme-col mb-2'>
                <SMEText loading={loading}>Billing Company</SMEText>
              </CCol>
              <CCol xs={12} md={4} className='sme-col'>
                <SMEFormSelect placeholder='Select Billing Company...' loading={loading}>
                  {billingCompanies.map((billingCompany) => (
                    <option key={billingCompany.name}>{billingCompany.name}</option>
                  ))}
                </SMEFormSelect>
              </CCol>
            </CRow>
            
            <CRow className='mb-3'>
              <CCol xs={12} md={2} className='sme-col-text mb-2'>
                <SMEText loading={loading}>Start Date</SMEText>
              </CCol>
              <CCol xs={12} md={4}>
                <SMECalendar loading={loading} />
              </CCol>
            </CRow>
            
            <CRow className='mb-3'>
              <CCol xs={12} md={2} className='sme-col-text mb-2'>
                <SMEText loading={loading}>End Date</SMEText>
              </CCol>
              <CCol xs={12} md={4}>
                <SMECalendar loading={loading} />
              </CCol>
            </CRow>
            
            <CRow className='mb-3'>
              <CCol xs={12} md={4} className='offset-md-2'>
                <SMEButton onClick={() => dispatch({type: 'GENERATE_REPORT'})} loading={loading}>
                  <CIcon icon={cilCopy} size="sm" /> Generate Report
                </SMEButton>  
              </CCol>
            </CRow>
          </>
          }
          
          {reportMode && 
            <>
              <CRow className='mb-3'>
                <CCol md={5} xs={0} className='text-right' style={{textAlign: 'right'}}>
                  <CIcon icon={cilTruck} size='5xl' className='pull-right d-none d-md-inline' />
                </CCol>
                <CCol md={7} xs={12}>
                    <div>Tutus Trucking Company</div>
                    <div>Address 1, Street 1, Block 10, Cabuyao, Laguna</div>
                    <div>TIN 291-232-123-000</div>
                </CCol>
              </CRow>
              
              <CRow className='mb-3'>
                <CCol md={3} className='offset-md-9' xs={12}>
                <CButton className='btn-dark w-100' onClick={() => dispatch({type: 'GENERATE_REPORT'})}>
                  <CIcon icon={cilCloudDownload} size="sm" /> Download PDF Invoice
                </CButton>  
                </CCol>
              </CRow>
              
              <SMESmartTable 
                headers={["Date", "Serial Number", "Source", "Destination", "Driver", "Helper", "Truck Plate No.", "Billing Company", "Price" ]}
                accessors={[
                  'date', 
                  'serialNumber', 
                  //{sourceId}) => indexedWarehouse[sourceId]?.name, 
                  'sourceId',
                  'destination', 
                  'driver', 
                  'helper', 
                  'truckPlateNo', 
                  'billingCompany',
                  'price', 
                ]}
                data={Array(7).fill({
                  date: '10/06/2021',
                  serialNumber: 'EBB-001',
                  sourceId: 'Cabuyao Warehouse',
                  destination: 'San Pedro Lazada',
                  driver: 'Mang Paking',
                  helper: 'Gardo',
                  truckPlateNo: 'UGO 518',
                  billingCompany: 'KlaudSol Philippines, Inc.',
                  price: '₱4,500',
                })}
                />
                
                <CRow className='mb-3'>
                  <CCol md={3} xs={12}>
                    BDO SA: 1233-1223-1232
                  </CCol>
                </CRow>
                
                <CRow className='mb-3'>
                  <CCol md={2} className="offset-md-10" xs={12}>
                    ₱13,500 (VAT Inclusive)
                  </CCol>
                  <CCol md={2} className="offset-md-10" xs={12}>
                    ₱1,446.43 - VAT
                  </CCol>
                  <CCol md={2} className="offset-md-10" xs={12}>
                    ₱241.07- Withholding Tax
                  </CCol>
                  <CCol md={2} className="offset-md-10" xs={12}>
                    <strong>₱13,258.93 - Net</strong>
                  </CCol>
                </CRow>
                
                
                  
              
          </>
          }
        </>
        )}
    </SMESessionChecker>
  );
  
};

export default Billing;