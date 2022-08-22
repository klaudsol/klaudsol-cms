import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CTooltip
} from '@coreui/react';

import CIcon from '@coreui/icons-react'
import { access } from '@sme/SMESmartTable';
import SMESkeleton from '@sme/SMESkeleton';
import SMECalendar from '@sme/SMECalendar';
import SMEFormInput from '@sme/SMEFormInput';
import SMEFormSelect from '@sme/SMEFormSelect';
import cx from 'classnames';
import { useReducer, useEffect } from 'react';
import { formatISO9075 } from 'date-fns';

const INITIAL_SKELETON_NUM_OF_ITEMS = 1;
const RESET_TIMEOUT = 2000;
const IDENTITY_FUNCTION = (x) => x;
const DEFAULT_EVENT_TARGET_VALUE_FUNCTION = (evt) => evt.target.value;


const SMESmartTableDesktop = ({columns, data, formActions, rowActions, children, loading}) => {
  
  const initialState = {
    rowMetadata: {},
    editForm: {},
    addForm: {
      date: formatISO9075(new Date())
    },
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'FADE_IN':   
        return {
          ...state,
          rowMetadata: {
            ...state.rowMetadata,
            [action.payload.id]: {
              ...state.rowMetadata[action.payload.id] ?? {},
              fadeIn: true, 
              fadeOut: false
            }
          }
        };
        
      case 'FADE_OUT':
        return {
          ...state,
          rowMetadata: {
            ...state.rowMetadata,
            [action.payload.id]: {
              ...state.rowMetadata[action.payload.id] ?? {},
              fadeIn: false, 
              fadeOut: true 
            }
          }
        };
        
      case 'FADE_RESET':
        return {
          ...state,
          rowMetadata: {
            ...state.rowMetadata,
            [action.payload.id]: {
              ...state.rowMetadata[action.payload.id] ?? {},
              fadeIn: false, 
              fadeOut: false
            }
          }
        };
        
      case 'EDIT_ON':
        return {
          ...state,
          rowMetadata: {
            ...Object.fromEntries(Object.entries(state.rowMetadata).map(([key, value]) => [key, {...value, edit: false}])), //reset all to false
            [action.payload.id]: {
              ...state.rowMetadata[action.payload.id] ?? {},
              edit: true
            },
          },
          editForm: data.find((row) => row.id === action.payload.id)
        };
        
      case 'EDIT_OFF':
        return {
          ...state,
          rowMetadata: {
            ...Object.fromEntries(Object.entries(state.rowMetadata).map(([key, value]) => [key, {...value, edit: false}])), //reset all to false
          }
        };
        
      case 'CHANGE_ADD_FORM':
        return {
          ...state,
          addForm: {
            ...state.addForm,
            [action.payload.name]: action.payload.value  
          }
        };
        
      case 'RESET_ADD_FORM':
        return {
          ...state, 
          addForm: {
            ...Object.fromEntries(Object.entries(state.addForm).map(([key, value]) => [key, ''])),
            date: state.addForm.date 
          }
        };
        
      case 'CHANGE_EDIT_FORM':
        return {
          ...state,
          editForm: {
            ...state.editForm,
            [action.payload.name]: action.payload.value  
          }
        };
        
      default:
        return state;
    };
    
  }
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    console.error(state);  
  }, [state]);
  
  const rowEffects = {
    fadeIn: (rowId) => {
      dispatch({type: 'FADE_IN', payload: {id: rowId}});
      setTimeout(() => dispatch({type: 'FADE_RESET',  payload: {id: rowId}}),  RESET_TIMEOUT);
    },
    fadeOut: (rowId) => {
      dispatch({type: 'FADE_OUT', payload: {id: rowId}});
    },
    editMode: (rowId, mode=true) => {
      let _mode;
      if (typeof mode === 'function') {
        _mode = mode(state.rowMetadata[rowId]?.edit);  
      } else {
        _mode = mode;  
      }
      dispatch({type: _mode ? 'EDIT_ON' : 'EDIT_OFF', payload: {id: rowId}});
    },
    resetEditMode: () => {
      dispatch({type: 'EDIT_OFF'});  
    },
    setForm:  (name, value) => {
      dispatch({
        type: 'CHANGE_EDIT_FORM',
        payload: {name, value}
      })  
    },   
  };
  
  const formEffects = {
    setForm:  (name, value) => {
      dispatch({
        type: 'CHANGE_ADD_FORM',
        payload: {name, value}
      })  
    },   
    resetAddForm: () => {
      dispatch({type: 'RESET_ADD_FORM'});    
    }
  };

  const onRowActionClicked = (row, rowAction, evt) => {
    rowAction.action && rowAction.action(row, rowEffects, evt); 
  }
  
  const onFormActionClicked = (formAction, evt) => {
    formAction.action && formAction.action(state.addForm, rowEffects, formEffects, evt);
  }
  
  /**
   *  name - the programmatic label of the column
   *  header - human-readable label of the column
   *  accessor - index or function to access RAW data (data from API / memory). If not defined, defaults to name 
   *  display - function used to render the data in view mode 
   *  formValue - the value bound to an input value, rendered in add and edit mode
   *  formValueFn - a preprocessor function that is called on formValue on special components where preprocessing of form value is needed (e.g. SMECalendar)
   *  formSerializer - a function that is called on the evt object on change of the input to be sent to in-memory state. 
   *    Usually not needed, as per default this is (evt) => evt.target.value, unless you are using special components (e.g. SMECalendar)
   */
  
  
  const renderFormForColumn = ({name, header, type, accessor, 
    display=IDENTITY_FUNCTION,
    formValue, formValueFn=IDENTITY_FUNCTION, formOnChange, 
    options, includeAdd, placeholder}) => {
    
    switch(type) {
      case 'date':
        return (
          <SMECalendar loading={loading} placeholder={placeholder ?? header} value={formValueFn(formValue)} onChange={formOnChange} />
        );
      case 'text':
        return (
          <SMEFormInput loading={loading} placeholder={placeholder ?? header} value={formValueFn(formValue)} onChange={formOnChange} />
        );
      case 'dropdown':
        return (
          <SMEFormSelect placeholder={placeholder ?? header} value={formValueFn(formValue)} 
            loading={loading}
            includeAdd={includeAdd}
            onChange={formOnChange}>
            {options}
          </SMEFormSelect>
        );
      case 'static':
        //The forOnChange of static needs to be dealt with somewhere, since it has no onChange
        return (
          <SMESkeleton loading={loading}>{display(formValue)}</SMESkeleton>
        );
      default:
        return null;
    }
  };
  
  const visibleRowActionsOnView = (rowActions) => rowActions.filter((rowAction) => rowAction.show?.onView ?? true )
  
  
  return (
    
      <CTable striped className='d-none d-md-table sme-smart-table-desktop'>
        <CTableHead>
          <CTableRow>
            {columns.map(({header}, headerIndex) => (
              <CTableHeaderCell key={`header-${header}`} scope="col">
                <SMESkeleton loading={loading}>
                {header}
                </SMESkeleton>
              </CTableHeaderCell>
            ))}
            {formActions && formActions.length > 0 &&
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            }
          </CTableRow>
        </CTableHead>
        <CTableBody>
        
          <CTableRow>
            
            {/** Add Form **/}
            {columns.map((column, formIndex) => (
            <CTableDataCell key={`child-${formIndex}`}>
              {renderFormForColumn({
                ...column, 
                formValue: state.addForm[column.name],
                formOnChange: (evt) => {
                  dispatch({
                    type: 'CHANGE_ADD_FORM', 
                    payload: {
                      name: column.name, 
                      value: (column.formSerializer ?? DEFAULT_EVENT_TARGET_VALUE_FUNCTION)(evt)
                    }
                  });  
                  column.formOnChange && column.formOnChange(evt, state.addForm, formEffects);
                }
              })}
            </CTableDataCell>
            ))}
            
            {formActions &&
            <CTableDataCell style={{width: "5%"}}>
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            
                  {/** Form actions **/}
                  {formActions && formActions.map((formAction, index) => ( 
                    <CTooltip key={`tooltip-${index}`} content={formAction.label}>
                      <CButton key={`formAction-${index}`} onClick={evt => onFormActionClicked(formAction, evt)} size="sm">
                        {!formAction.loading && !loading &&
                          <CIcon icon={formAction.icon} size="sm" />
                        }
                        {(formAction.loading || loading) &&
                          <CSpinner color="light" size="sm"/>
                        }
                      </CButton>
                    </CTooltip>
                  ))}
                  
                  {
                    visibleRowActionsOnView(rowActions)?.length > formActions?.length && Array(visibleRowActionsOnView(rowActions).length - formActions.length).fill().map((item, index) => ( 
                      <CButton key={`rowAction-${index}`} style={{opacity: 0}} size="sm">&nbsp;</CButton>
                  ))}   
              
              </div>
            </CTableDataCell>
            }
          </CTableRow>
        
          {!loading && data.map((row, index) =>( 
            <CTableRow key={`data-${row.id}`} className={cx('sme-smart-table-desktop__row',{
              fadeIn: state.rowMetadata[row.id]?.fadeIn,
              fadeOutX: state.rowMetadata[row.id]?.fadeOut
            })}>
            
              {/** Actual data here **/}
              {columns.map((column, index2) => (
                <CTableDataCell key={`data-${row.id}-${index2}`} style={{whiteSpace: 'nowrap'}}>
                {state.rowMetadata[row.id]?.edit ?                                                                  //Edit Mode 
                  renderFormForColumn({...column, formValue: access(state.editForm, column.accessor ?? column.name), 
                    formOnChange:(evt) => {
                      dispatch({
                        type: 'CHANGE_EDIT_FORM', 
                        payload: {
                          name: column.name, 
                          value: (column.formSerializer ?? DEFAULT_EVENT_TARGET_VALUE_FUNCTION)(evt)
                        }
                      });  
                      column.formOnChange && column.formOnChange(evt, state.editForm, rowEffects);
                      } }) :       
                  (column.display ?? IDENTITY_FUNCTION)(access(row,column.accessor ?? column.name))                //View Mode
                }
                </CTableDataCell>
              ))}
              
              
              {/** Row actions **/}
              <CTableDataCell>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  {rowActions && rowActions.map((rowAction, index2) => (
                      <>
                        {/**View Mode **/}
                        {(!state.rowMetadata[row.id]?.edit && (rowAction.show?.onView ?? true)) && (
                        <CTooltip content={rowAction.label}>
                          <CButton variant="ghost" color="dark" size="sm" key={`button-${row.id}-${index2}`} onClick={evt => onRowActionClicked(row, rowAction, evt)}>
                            <CIcon icon={rowAction.icon} size="sm" />
                          </CButton>
                        </CTooltip>
                        )} 
                        
                        {/**Edit Mode **/}
                        {(state.rowMetadata[row.id]?.edit && rowAction.show?.onEdit) && (
                        <CTooltip content={rowAction.label}>
                          <CButton variant="ghost" color="dark" size="sm" key={`button-${row.id}-${index2}`} onClick={evt => onRowActionClicked(state.editForm, rowAction, evt)}>
                            <CIcon icon={rowAction.icon} size="sm" />
                          </CButton>
                        </CTooltip>
                        )} 
                        
                        
                      </>
                  ))}
                </div>
              </CTableDataCell>
              
            </CTableRow>
          ))}
          
          {loading && Array(INITIAL_SKELETON_NUM_OF_ITEMS).fill().map((item, index) => (
            <CTableRow key={index}>
              {columns.map((column, index2) => (
                <CTableDataCell key={index2}><SMESkeleton loading={loading} /></CTableDataCell>
              ))}
              <CTableDataCell></CTableDataCell>
            </CTableRow>
          ))}
          
        </CTableBody>
      </CTable>    
    );
  
};

SMESmartTableDesktop.defaultProps = {
  onAdd: () => {},
  loading: false,
  formActions: [],
  rowActions: []
};

export default SMESmartTableDesktop;