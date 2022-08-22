import {
  CFormSelect
} from '@coreui/react';
import SMESkeleton from '@sme/SMESkeleton';

const SMEFormSelect = ({onChange, form, includeAdd, className, loading, ...props}) => {
  
  const myOnChange = (evt) => {
    if(evt.target.value === '-1') {
      evt.preventDefault();  
      evt.target.value = '';
    } else {
      if(onChange) onChange(evt);
    }
  };
  
  let style;
  
  switch(form) {
    case 'mobile':
      style = {};
      break;
    case 'desktop':
    default:
      style = {height: '30px', fontSize: '0.875rem', padding: '0rem 2.25rem 0rem 0.75rem', cursor: 'pointer'};
  }
  
  return (
    <> 
      <SMESkeleton className={className} loading={loading} >
        <CFormSelect {...props} style={style} onChange={myOnChange} className={className}>
          <option value=''>{props.placeholder}</option>
          {props.children}
          {includeAdd &&
            <option value="-1">+ Add New...</option>
          }
        </CFormSelect>  
      </SMESkeleton>
    </>
          
  );
  
  
};

SMEFormSelect.defaultProps = {
  form: 'desktop',
  includeAdd: false,
  loading: false
}

export default SMEFormSelect;