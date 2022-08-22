
import {
  CFormInput,
  CInputGroup
} from '@coreui/react';
import SMESkeleton from '@sme/SMESkeleton';

const SMEFormInput = ({readOnly, loading, onChange, ...props}) => {
  return ( 
      <SMESkeleton loading={loading}>
        <CInputGroup size="sm">
          <CFormInput style={{height: '30px'}} {...props} readOnly={readOnly} onChange={onChange}/>
        </CInputGroup>
      </SMESkeleton>
  );
};


SMEFormInput.defaultProps = {
  loading: false,  
  onChange: () => {}
}

export default SMEFormInput;