import {
  CContainer,
  CRow,
  CCol,
  CFormLabel,
  CButton
} from '@coreui/react'

//import '@sme/scss/SMESmartTable.scss';
import { access } from '@sme/SMESmartTable';
import SMESkeleton from '@sme/SMESkeleton';


const SMESmartTableMobile = ({columns, loading, data, formActions, children}) => {
  
  
  return (
    <CContainer className='d-block d-md-none pt-3'>
      <CRow className="align-items-center">
      
        {data.map((item, index) => (
         <div key={`data-${index}`}>
         {columns.map(({accessor}, index2) => (
            <>
              <CCol sm="12" className='mb-1' key={`header-${index}-${index2}`}>
                <CFormLabel className="col-form-label">
                  <SMESkeleton loading={loading}>
                    {columns[index2].header}
                  </SMESkeleton>
                </CFormLabel>
              </CCol>
              <CCol sm="12" className='mb-1 sme-smart-table-mobile__data' key={`child-${index}-${index2}`}>
                {access(item,accessor)}
              </CCol>
            </> 
          ))}
          <hr />
          </div>
        ))}
      
        
        {/*children && children.map((child, index) => (
        <div key={`child-${index}`}>
          <CCol sm="12" className='mb-1' key={`header-${index}`}>
            <CFormLabel className="col-form-label">
             <SMESkeleton loading={loading}>
                {columns[index].header}
              </SMESkeleton>
            </CFormLabel>
          </CCol>
          <CCol sm="12" className='mb-1' key={`child-${index}`}>
            {child}
          </CCol>
        </div> 
        ))*/}
        
        <div className='mt-2 mb-2'></div>
       
       {formActions && formActions.map((action, index) => ( 
          <CCol sm="12" className='mb-1' key={index} >
            <CButton className='sme-smart-table-mobile__action' onClick={action.action}>{action.label}</CButton>
          </CCol>
        ))}
        
        
      </CRow>
    </CContainer>
  );
  
};

SMESmartTableMobile.defaultProps = {
  loading: false  
};


export default SMESmartTableMobile;