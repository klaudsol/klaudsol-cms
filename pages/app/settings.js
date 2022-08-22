import { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import InnerLayout from '@/components/layouts/InnerLayout';
import SMEIconContainer from '@/lib/sme/SMEIconContainer';
import CacheContext from '@/components/contexts/CacheContext';
import { getSessionCache } from '@/lib/Session';
import DropDown from '@/components/timetracking/DropDown';
import { useFadeEffect, slsFetch } from '@/components/Util';
import styles from '@/styles/Settings.module.scss';
import cx from 'classnames';

export default function Settings({cache}){

  const initialState = {
    isLoading: false,
    isEditable: false,
    isDisabled: true,
    isHidden: true,
    isEdit: false,
    submitted: false,  
    isError: false,
    isLoading: false,
    isUpdateSuccessful: false,
    isEqual: false,
    isNotEqual: false,
    isEmpty: false,
    isChangePass: false,
    isDisabledPass: true,
    isHiddenPass: true
  }

  const reducer = (state, action) => {
    switch(action.type) {
      case 'LOADING':
        return {
          ...state,
          isLoading: true,
        }
      case 'EDIT':
        return{
          ...state,
          isEditable: false,
          isDisabled: false,
          isHidden: false,
          isEdit: true
        }
      case 'SUCCESS':
        return {
          ...state,
          isUpdateSuccessful: true,
          isChangePass: false,
          isError: false,
          isNotEqual: false,
          isEmpty: false,
          submitted: true
        }
      case 'ERROR':
        return {
          ...state,
          isUpdateSuccessful: false,
          isError: true,
          isEmpty: false,
          isNotEqual: false,
          submitted: true
        }
      case 'NOT_EQUAL':
        return {
          ...state,
          isUpdateSuccessful: false,
          isNotEqual: true,
          isEmpty: false,
          isError: false,
          submitted: true
        }
      case 'EMPTY':
        return {
          ...state,
          isUpdateSuccessful: false,
          isEmpty: true,
          isError: false,
          submitted: true
        }
      case 'CHANGE':
        return {
          ...state,
          isChangePass: true,
          isDisabledPass: false,
          isHiddenPass: false
        }
      case 'CLEANUP':
        return {
          ...state,
          isEditable: true,
          isDisabled: true,
          isHidden: true,
          isEdit: false,
          isDisabledPass: true,
          isHiddenPass: true
        }
      case 'CLEANER':
        return{
          ...state,
          isUpdateSuccessful: false,
          isNotEqual: false,
          isError: false,
          isEmpty: false,
          submitted: false
        }
      case 'NOT_LOADING':
        return{
          ...state,
          isLoading: false
        }
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [people, setPeople] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [eMail, setEmail] = useState('');
  const [secretPassword, setSecretPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [row_id, setRowID] = useState();
  const [timeZoneList, setTimeZoneList] = useState([]);
  const [sme_timezone_id, setTimeZoneId] = useState();
  const [person_timezone_country, setTimezoneCountry] = useState('');
  const [person_timezone_offset, setTimezoneOffset] = useState('');
  const [person_timezone, setTimezone] = useState('');
  const [defaultTimezone, setDefaultTimezone] = useState([]);

  const errorBox = useRef();
  const successBox = useRef();
  const notEqualBox = useRef();
  const emptyBox = useRef();

    const fetchData = useCallback(() => {
        (async () => {
          try {
            dispatch({type: 'LOADING'});
            const fetchData = await slsFetch(`/api/core/people/me`);
            const personData = await fetchData.json();

            setPeople(personData);
            setFirstName(personData.first_name);
            setLastName(personData.last_name);
            setEmail(personData.email);
            setRowID(personData.id);
            setTimeZoneId(personData.sme_timezone_id);
            setTimezoneCountry(personData.sme_timezone_country);
            setTimezoneOffset(personData.sme_timezone_offset);
            setSecretPassword("Secret");

            setDefaultTimezone([
              {label: personData.sme_timezone_country, value: personData.sme_timezone_offset}
             ])

            const fetchDataTZ = await slsFetch(`/api/app/settings/timezones`);
            const timezoneList = await fetchDataTZ.json();

            setTimeZoneList(timezoneList);
          } catch (ex) {
            console.error(ex.stack); 
          }finally{
            dispatch({type: 'NOT_LOADING'});
          }
        })();
      }, []);

      const onUpdate = useCallback((row_id, first_name, last_name, email, oldPassword, newPassword, sme_timezone_id) => {
        let id = row_id;
        (async () => {
          try {
              const response = await slsFetch(`/api/core/people/me`, {
              method: 'PUT',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({id, first_name, last_name, email, oldPassword, newPassword, sme_timezone_id})
            })
            fetchData();
            dispatch({type: 'SUCCESS'});
          }
          catch (ex) {  
            console.error(ex.stack);  
            dispatch({type: 'ERROR'});
          }finally {
            dispatch({type: 'CLEANUP'});
            
          }
        })();
      }, [fetchData]);

      const timezones = timeZoneList.map(tz => (
        {id: tz.id, label: tz.timezones_country, value: tz.timezones_offset}
      ));
    

      useFadeEffect(errorBox, [state.submitted, state.isError]);
      useFadeEffect(successBox, [state.submitted, state.isUpdateSuccessful]);
      useFadeEffect(notEqualBox, [state.submitted, state.isNotEqual]);
      useFadeEffect(emptyBox, [state.submitted, state.isEmpty]);

      const onEdit = () => {
        dispatch({type: 'EDIT'});
      };
      
      const onChangePass = () => {
        dispatch({type: 'CHANGE'});
      };

      function onSave(id) {
        if(state.isChangePass){
          if(confirmPassword != newPassword) {
            dispatch({type: 'NOT_EQUAL'});
          }
          else if(newPassword == '' || confirmPassword == ''){
            dispatch({type: 'EMPTY'});
          }
          else{
            
            onUpdate(id, firstName, lastName, eMail, oldPassword, newPassword, sme_timezone_id);
          }
        }
        else{
          
          onUpdate(id, firstName, lastName, eMail, oldPassword, newPassword, sme_timezone_id);
        }
      };

      useEffect(() => {
        fetchData();
      }, []);

    return (
        
        <CacheContext.Provider value={cache}>
            <InnerLayout>  
                <SMEIconContainer>
                    <div className={cx('container')}>
                        <div className={cx('space-around')}>
                            <div className ={cx('row')} >
                            <div ref={errorBox} className="alert alert-danger useFadeEffect">
                              <p>Incorrect password</p>
                            </div>
                            <div ref={notEqualBox} className="alert alert-danger useFadeEffect">
                              <p>New Password and Confirm Password is not match!</p>
                            </div>
                            <div ref={emptyBox} className="alert alert-danger useFadeEffect">
                              <p>Input boxes cannot be empty!</p>
                            </div>
                            <div ref={successBox} className="alert alert-success useFadeEffect">
                              <p>Successfully Update!</p>
                            </div>
                                <div className={cx(styles['leFt'], 'col-sm-3')} >
                                    <p>First name: </p> 
                                    <p>Last name: </p> 
                                    <p>E-mail: </p>
                                    <p hidden={!state.isHiddenPass}>Password: </p>
                                    <p disabled={state.isDisabledPass} hidden={state.isHiddenPass} >Old Password: </p>
                                    <p disabled={state.isDisabledPass} hidden={state.isHiddenPass} >New Password: </p>
                                    <p disabled={state.isDisabledPass} hidden={state.isHiddenPass} >Confirm Password: </p>
                                    <p>Time Zone: </p>
                                </div>
                                {
                                    <div className={cx(styles['rIght'], 'col-sm-4')}>
                                      <input type="text" className="form-control" onChange={(e) => setFirstName(e.target.value)} value ={firstName} aria-label="Username" disabled={state.isDisabled}  />
                                      <input type="text" className="form-control" onChange={(e) => setLastName(e.target.value)} value ={lastName} aria-label="Lastname" disabled={state.isDisabled}  />
                                      <input type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} value ={eMail} aria-label="Email" disabled={state.isDisabled}  />

                                      <input type="password" className="form-control" onClick={onChangePass} value ={secretPassword} aria-label="Password" disabled={state.isDisabled} hidden={!state.isHiddenPass} />
                                      
                                      {/* Old Password must be validate. if old password is incorrect user cannot update firstname, lastname, email, password, and timezone */}
                                      <input type="password" className="form-control" onChange={(e) => setOldPassword(e.target.value)} value ={oldPassword} aria-label="Old Password" disabled={state.isDisabledPass} hidden={state.isHiddenPass} />
                                      
                                      {/* Setting new password must need to validate in confirm password if new password is not same in confirming input box user cannot update his/her account and input must not empty */}
                                      <input type="password" className="form-control" onChange={(e) => setNewPassword(e.target.value)} value ={newPassword} aria-label="New Password" disabled={state.isDisabledPass} hidden={state.isHiddenPass} />
                                      <input type="password" className="form-control" onChange={(e) => setConfirmPassword(e.target.value)} value ={confirmPassword} aria-label="Confirm Password" disabled={state.isDisabledPass} hidden={state.isHiddenPass}/>
                                      {!state.isLoading && (
                                      <DropDown options={timezones} defaultValue={defaultTimezone}  handleOnChange= {e => setTimeZoneId(e.id)} isDisabled={state.isDisabled} />
                                      )}
                                      
                                      <input type="submit" className={cx(styles['btnEdit'], 'btn btn-secondary')} onClick={onEdit} value="Edit" hidden={state.isEdit} />
                                      <input type="submit" className={cx(styles['btnSave'], 'btn btn-secondary')} onClick={() => onSave(row_id)} value="Save Changes" disabled={state.isDisabled} hidden={state.isHidden} />
                                  </div>
                                }
                                
                            </div>
                        </div>
                        
                    </div>
                </SMEIconContainer>        
            </InnerLayout>
        </CacheContext.Provider>
    )
    
}

export const getServerSideProps = getSessionCache();