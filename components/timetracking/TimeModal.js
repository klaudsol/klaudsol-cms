import { useState, useEffect,useCallback, useRef, useReducer} from "react";
import {useRouter} from 'next/router';
import ReactDOM from "react-dom";
import Image from 'next/image'
import { slsFetch } from '@/components/Util'; 
import { FaTimes } from 'react-icons/fa';
import DropDown from '@/components/timetracking/DropDown';

export default function TimeModal({show, modalClose, onclk_startTimeModal, fetchData, spinnerLoading, clientOptions, defaultOption }){
    // initialize constants
    const [isBrowser, setIsBrowser] = useState(false);
    const [description, setDescription] = useState('');

    const [borderColor, setBorderColor] = useState('#324b4e');
    const [errorFontSize, setErrorFontSize] = useState('1px');
    const [errorFontColor, setErrorFontColor] = useState('#fff');

    const [selectedClient, setClient] = useState();

    const onSubmit = useCallback((evt) => {
        evt.preventDefault();
        spinnerLoading();
        var client_id;
        if(selectedClient == null){
            client_id = defaultOption.value;
        } else {
            client_id = selectedClient;
        }
        let start_time;
        let end_time;
        let duration;
        (async () => {
            try {
              const response = await slsFetch('/api/app/timetracking/create', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify({start_time, end_time, duration, description, client_id})
              })
              fetchData();
            } catch(ex) {
              alert(ex);  
            } 
        })();
      }, [description, selectedClient, defaultOption.value, spinnerLoading]);


    useEffect(()=> {
        setIsBrowser(true);
    }, []);

    const handleClose = (e) =>{
        e.preventDefault();
        modalClose();
        setDescription('');
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
        if(description !== ""){
            setBorderColor('#324b4e')
            setErrorFontColor('#fff');
            setErrorFontSize('1px');
        } 
    }
    const handleStart = (e) => {
        e.preventDefault();
        if(description === ""){
            setBorderColor('red');
            setErrorFontColor('red');
            setErrorFontSize('12px');
        }else{ 
            setDescription('');
            onSubmit(e);
            onclk_startTimeModal();
        }
    }   

    const selectClient = (e) => {
        setClient(e.value);
    }

    // content of modal
    const modalContent = show ? (
        <div className="timeModal_overlay">
            <div className="timeModal">
                <div className="timeModal_header">
                    <a href="#" onClick={handleClose}>
                        <button className="btn_close_modal">
                            <FaTimes></FaTimes>
                        </button>
                    </a>
                </div>
                <div className="container">
                   <h5 className="col-xl-12 col-md-12 col-sm-12 col-xs-12"> You have started your time. <br/> Please enter a description for your task. </h5> 
                   <textarea name="description" id="message" placeholder="Enter description" className="timeModal_textarea" style={{borderColor: borderColor}} 
                    required
                    value={description}
                    onChange={handleDescriptionChange}
                />
                    <p className="p_error" style={{color: errorFontColor, fontSize: errorFontSize}}> Please fill out the description box. </p>
                </div>
                <div className="d-flex flex-row-reverse"> 
                    <button className='btn btn-success d-flex flex-row-reverse btn_start_modal' onClick={handleStart}> START </button>
                    <DropDown options={clientOptions} defaultValue={defaultOption} handleOnChange={selectClient} isDisabled={false}  />
                </div>
            </div>
        </div>
    ) : null;

    if (isBrowser) {
        return ReactDOM.createPortal(
          modalContent,
          document.getElementById("modal-root")
        );
      } else {
        return null;
      }
}