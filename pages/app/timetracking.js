import { useState, useEffect, useCallback, useReducer } from 'react';
import TimeModal from '@/components/timetracking/TimeModal';
import InnerLayout from '@/components/layouts/InnerLayout';
import CardCurrentTask from '@/components/timetracking/CardCurrentTask';
import TimetrackingDate from '../../components/timetracking/TimetrackingDate'
import { slsFetch } from '@/components/Util'; 
import Clock from 'react-live-clock';
import CacheContext from '@/components/contexts/CacheContext';
import { getSessionCache } from '@/lib/Session';
import { FaTrash, FaPlay, FaStop, FaDownload, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import SkeletonTask from '@/components/timetracking/SkeletonTask';
import SkeletonTimesheet from '@/components/timetracking/SkeletonTimesheet';
import DropDown from '@/components/timetracking/DropDown';
import CSVDownloader from 'react-csv-downloader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TimeTracking({cache}) {
  // initialize components
  const initialState = {
    isLoading: false,
    isEndTimeBlank: false,  
    isRefresh: true,
    currentTaskColor: '#fff',
    currentTaskTextColor: '#324b4e',
    playStopIcon: <FaPlay/>,
    playStopColor: '#019867',
    currentTaskText: 'NO TASK AS OF THE MOMENT',
    displayDelete: 'block',
    isEditable: false,
    initialStartDate: null,
    initialEndDate: null,
    initialClientID: null,
    initialClientName: null,
    initialDescription: null,
    initialDuration: null,
    isAddTime: false,
    isEditing: false,
  };

  // using a reducer to change / alter UI when tasks are running / idle 
  const reducer = (state, action) => {
    switch(action.type) {
      case 'LOADING':
        return {
          ...state,
          isLoading: true,
        }
      case 'IDLE':
        return {
          ...state, 
          currentTaskText: 'NO TASK AS OF THE MOMENT',
          isEndTimeBlank: false,
          currentTaskColor: '#fff',
          playStopIcon: <FaPlay/>,
          playStopColor: '#019867',
          currentTaskTextColor: '#324b4e',
        }
      case 'RUNNING':
        return {
          ...state, 
          currentTaskText: 'TASK:',
          isEndTimeBlank: true,
          currentTaskColor: '#324b4e',
          playStopIcon: <FaStop/>,
          playStopColor: '#fff',
          currentTaskTextColor: '#fff7e4',
        }
      case 'CLEANUP':
        return {
          ...state,
          isLoading: false,
          isRefresh: false,
        }
      case 'EDIT_MODE':
          return {
            ...state,
            isEditable: true,
          }
      case 'READ_ONLY':
        return {
          ...state, 
          isEditable: false,
        }
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const [isMounted, setIsMounted] = useState(false);

  /* Constants for Timesheet */
  const [showModal, setShowModal] = useState(false); // determines if modal will display or not

  const [dbStartTime, setDbStartTime] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [averageHours, setaverageHours] = useState ('0');
  const [currentTaskStartTime, setCurrentTaskStartTime] = useState('');
  const [currentTaskClient, setCurrentTaskClient] = useState('');

  const [seconds, setSeconds] = useState(0);

  const [lastRowData, setLastRowData] = useState([]);

  const [totalHours, setTotalHours] = useState('0');
  const [timesheet_data, setTimesheetData] = useState([]);
  const [timesheet_data_all, setTimesheetDataAll] = useState([]);

  const [delete_display, setDeleteDisplay] = useState('none');

  const [clientOptions, setClientOptions] = useState([]);
  const [actualClients, setActualClients] = useState([]);
  const [defaultOption, setDefaultOption] = useState([]);
  const [defaultOptionModal, setDefaultOptionModal] = useState([]);

  const [selectedClient, setClient] = useState();
  const [selectedTimerange, setTimerange] = useState();

  const [csvFilename, setCSVFilename] = useState();

  const [row_id, setRowID] = useState();
  const [client_id, setClientID] = useState();
  
  const [change, setChange] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [description, setDescription] = useState('');

  const [defaultClientName, setDefaultClientName] = useState();
  const [defaultClientID, setDefaulClientID] = useState();

  const [duration, setDuration] = useState();


  // columns for tables
  const columns = [
    { id: "start_time", displayName: "Start Time", accessor: "start_time" },
    { id: "end_time", displayName: "End Time", accessor: "end_time" },
    { id: "duration", displayName: "Duration", accessor: "duration" },
    { id: "client_name", displayName: "Client", accessor: "client_name" },
    { id: "description", displayName: "Description", accessor: "description" },
    { id: "buttons", displayName: "", accessor: "" },
  ];
  
  // options for timerange
  const timerangeOptions = [
    {label: "All", value: ''},
    {label: "Today", value: "today"},
  ]

  useEffect(() => {
    setIsMounted(true);
    fetchData(selectedClient, selectedTimerange);
  }, [selectedClient, selectedTimerange]);

  // function that changes the ui and text of current task card
  const setCardCurrentTask = (lastRowData) =>{
    if(!lastRowData.end_time){
      dispatch({type: 'RUNNING'});
      var timetracking_date = new TimetrackingDate();
      setDbStartTime(lastRowData.start_time);
      setCurrentTaskStartTime(timetracking_date.convertUTC(lastRowData.start_time));
      setCurrentTaskClient(lastRowData.client_name);
      setTaskDescription(lastRowData.description);
    } else {
      dispatch({type: 'IDLE'});
    }
  }

  // function that deletes the row
  const onclk_delete = useCallback((rowId) => {
    var id = rowId;
    (async () => {
        try {
          dispatch({type: 'LOADING'});
          const response = await slsFetch('/api/app/timetracking/delete', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({id})
          })
          fetchData(selectedClient, selectedTimerange);
        } catch(ex) {
          alert(ex.stack);  
        } 
    })();
  }, [selectedClient, selectedTimerange]);
  
  //fetch data from database
  const fetchData = useCallback((selectedClient, selectedTimerange) => {
    (async () => {
      try {
        dispatch({type: 'LOADING'});
        var timetracking_date = new TimetrackingDate();
        var client_id;
        var total_hours = 0;
        var timerange;

        const fetchAllData = await slsFetch('/api/app/timetracking');
        const timesheet_data_all = await fetchAllData.json();

        const fetchClients = await slsFetch('/api/app/timetracking/display_customers');  
        const clients = await fetchClients.json();

        let final_client_options = [];
        let actual_clients = [];
        let default_client = [];
        let initial_client_options = clients.map((i) => i.display_name);
        let initial_client_value = clients.map((i) => i.sme_customer_id);
        let client_default = clients.map((i) => i.is_default);
        let client_label;
        let temp;

        var date_now = new Date().toLocaleString();
        for(let i = 0; i<initial_client_options.length; i++){
          if(selectedClient === initial_client_value[i]){
            client_label = initial_client_options[i];
          }
          if(client_default[i] === true || initial_client_options.length === 1){
            default_client = { label: initial_client_options[i], value: initial_client_value[i]};
            setDefaultClientName(initial_client_options[i]);
            setDefaulClientID(initial_client_value[i]);
          }
            temp = { label: initial_client_options[i], value: initial_client_value[i]};
            final_client_options.push(temp);
            actual_clients.push(temp);
        }
        final_client_options.push({value: 'ALL', label: "All Clients"});

        setActualClients(actual_clients);
        setClientOptions(final_client_options);
        setDefaultOption(default_client);
        setDefaultOptionModal(default_client);
        
        
        if(selectedClient == null){
            client_id = default_client.value;
            setCSVFilename(default_client.label + " - " + date_now);
        } else if (selectedClient === 'ALL'){
            client_id = null;
            setDefaultOption({value: 'ALL', label:"All Clients"});
            setDefaultOptionModal(default_client);
            setCSVFilename("All Clients - " + date_now);
        } else {
            client_id = selectedClient;
            setDefaultOption({value: client_id, label: client_label});
            setDefaultOptionModal({value: client_id, label: client_label});
            setCSVFilename(client_label + " - " + date_now);
        }

        if(selectedTimerange != null){
          timerange = selectedTimerange;
        } else if (selectedTimerange === ''){
          timerange = null;
        }

        const fetchDataParams = Object.fromEntries(
          Object.
            entries({client_id: client_id ?? null, timerange: timerange ?? null }).
            filter(([key, value]) => value)
        );
          
        const fetchData = await slsFetch(`/api/app/timetracking?${new URLSearchParams(fetchDataParams)}`);
        const timesheet_data = await fetchData.json();
  
          if(timesheet_data_all.length === 0){
            setDeleteDisplay('none');
            dispatch({type: 'IDLE'});
            setTimesheetData([]);
          } else {
            timesheet_data.map((timesheet) => {
              timesheet.start_time = timetracking_date.convertUTC(timesheet.start_time);
              timesheet.end_time = timetracking_date.convertUTC(timesheet.end_time);
              if(timesheet.duration != null) total_hours += parseFloat(timesheet.duration);
            });
            setDeleteDisplay('block');
            setTimesheetData(timesheet_data);
            setTimesheetDataAll(timesheet_data_all);
            setCardCurrentTask(timesheet_data_all[0]);
            setLastRowData(timesheet_data_all[0]);
          }

          const totalHours = (timesheet_data) => 
          timesheet_data.map(timesheet => parseFloat(timesheet.duration) || 0).reduce((sum, duration) => sum + duration, 0 );

          const getAverageHours = (timesheet_data) => {
            let startTimeDates = timesheet_data.map((timesheet) => new Date(timesheet.start_time).toLocaleDateString());
            startTimeDates = [...new Set(startTimeDates)];
            const totalDaysWorked = startTimeDates.length;
            return startTimeDates.length != 0 ? totalHours(timesheet_data)/parseFloat(totalDaysWorked): 0;
            }

        total_hours == null ? setTotalHours('0') : setTotalHours(total_hours.toFixed(3).toString());
        const averageHawrs = getAverageHours(timesheet_data);
        setaverageHours(averageHawrs ? averageHawrs.toFixed(3).toString() : '0');

      } catch (ex) {
        console.error(ex.stack)
      } finally {
        dispatch({type: 'CLEANUP'});
      }
    })();
  }, []);
  
  // function when End Time button is clicked
  const onUpdate = useCallback((row_id, client_id, start_time, end_time, duration, description) => {
    let id = row_id;
    (async () => {
        try {
          dispatch({type: 'LOADING'});
          const response = await slsFetch('/api/app/timetracking/update', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({id, client_id, start_time, end_time, duration, description})
          })
          fetchData(selectedClient, selectedTimerange);
        } catch(ex) {
          alert(ex.stack);  
        } 
    })();
  }, [selectedClient, selectedTimerange]);

  // function when End Time button is clicked
  const onManualAdd = useCallback((start_time, end_time, duration, client_id, description) => {
    (async () => {
        try {
          dispatch({type: 'LOADING'});
          const response = await slsFetch('/api/app/timetracking/create', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({start_time, end_time, duration, description, client_id})
          })
          fetchData(selectedClient, selectedTimerange);
        } catch(ex) {
          alert(ex);  
        } 
    })();
  }, [selectedClient, selectedTimerange]);

  // for the timer 
  useEffect(()=> {
    var timetracking_date = new TimetrackingDate();
    let interval = null;
    let thestart = new Date(timetracking_date.convertUTCTime(dbStartTime));
    let timerStart = thestart.getTime();
    let endTimer = new Date();
    if(!state.isLoading){
      if(state.isEndTimeBlank){
        interval = setInterval(()=> {
        endTimer = new Date().getTime();
        setSeconds(endTimer-timerStart);
        }, 10)
      } else {
        clearInterval(interval)
        setSeconds(0);
        setTaskDescription(' ');
        setDbStartTime(' ');
        setCurrentTaskStartTime(' ');
        setCurrentTaskClient(' ');
      }
      return ()=> clearInterval(interval)
    }
      
  }, [state.isEndTimeBlank, dbStartTime, state.isLoading])

 
  // function that will be triggered if start time button is clicked
  function onclk_startTime() {
    setShowModal(true);
  }

  const onclk_endTime = () => {
    onUpdate(lastRowData.id, null, null, null, null, null);
    setShowModal(true);
  };

  // function that will be triggered if modal start button is clicked
  function startTimeModal(){  
    setShowModal(false);
    state.isEndTimeBlank = true;
  }

  // function that will be triggered if modal close button is clicked
  function modalClose(){
    setShowModal(false);
  }

  // function to determine if spinner is loading or not
  function spinnerLoading(){
    dispatch({type: 'LOADING'});
  }

  // function that lets the window confirm box to appear
  function confirmDeletion(id){
    if(confirm("Are you sure you want to delete?")){
      onclk_delete(id);
    }
  }

  function onEdit(id, start_time, end_time, client_id, client_name, description, duration){
    var timetrackingDate = new TimetrackingDate();
    const timesheet = timesheet_data;
    const last = timesheet[0];
    state.initialStartDate = start_time;
    state.initialEndDate = end_time;
    state.initialClientID = client_id;
    state.initialClientName = client_name;
    state.initialDescription = description;
    state.initialDuration = duration;
    if (last.add){
      timesheet.shift();
      state.isAddTime = false;
    } else {
      dispatch({type: 'EDIT_MODE'});
      setRowID(id);
      setClientID(client_id);
      setStartDate(timetrackingDate.convertToUTC(start_time));
      setEndDate(timetrackingDate.convertToUTC(end_time));
      setDescription(description);
      setDuration(duration);
    }
    setTimesheetData(timesheet);
    setChange(!change);
  }

  function getDuration(startDate, endDate){
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);
    var difference = (dateEnd.getTime() - dateStart.getTime()) / 1000;
    difference /= (60*60);
    return parseFloat(difference).toFixed(4);
  }

  function onSave(id){
    dispatch({type: 'READ_ONLY'});
    const timesheet = timesheet_data;
    const last = timesheet[0];
    state.isEditing = false;
    if (last.add){
      onManualAdd(startDate, endDate, duration, client_id, description);
      timesheet.shift();
      state.isAddTime = false;
    } else {
      onUpdate(id, client_id, startDate, endDate, duration, description);
    }
  
    state.isEditing = false;

  }

  function onDiscard(id){
    dispatch({type: 'READ_ONLY'});
    const timesheet = timesheet_data;
    const last = timesheet[0];
    state.isEditing = false;
    if (last.add){
      timesheet.shift();
      state.isAddTime = false;
    } else {
      timesheet.map((data) => {
        if(data.id === id){
          data.start_time = state.initialStartDate;
          data.end_time = state.initialEndDate;
          data.client_id = state.initialClientID;
          data.client_name = state.initialClientName;
          data.description = state.initialDescription;
        }
      })
    }
    setTimesheetData(timesheet);
    setChange(!change);
  }

  function onAddTime(){
    dispatch({type: 'EDIT_MODE'});
    var timetrackingDate = new TimetrackingDate();
    const data = timesheet_data;
    state.isAddTime = true;
    const date = new Date();
    const defaultStartDate = date.setDate(date.getDate() - 1); // start time is one day earlier than the end time
    const defaultEndDate = Date.now();
    const defaultDuration = getDuration(defaultStartDate, defaultEndDate);
    data.unshift({start_time: defaultStartDate, end_time: defaultEndDate, id: 0, client_name: defaultOptionModal.label, client_id: defaultOptionModal.value, description: "", duration: defaultDuration, add: true, });
    setStartDate(timetrackingDate.convertToUTC(defaultStartDate));
    setEndDate(timetrackingDate.convertToUTC(defaultEndDate));
    setDescription("");
    setRowID(0);
    setTimesheetData(data);
    setDuration(defaultDuration);
    setClientID(defaultOptionModal.value);
    setChange(!change);
  }
  
  if (!isMounted) {
    return null
  }
    return ( 
    <CacheContext.Provider value={cache}>
      <>
        <TimeModal show={showModal} modalClose={modalClose} onclk_startTimeModal={startTimeModal} fetchData={()=>fetchData(selectedClient, selectedTimerange)} spinnerLoading={spinnerLoading} clientOptions={actualClients} defaultOption={defaultOptionModal}/>
        <InnerLayout> 
          <>
            <div className='container-fluid'> {/* time tracking main container START*/}
              <div className='row gx-4'> {/* row #1 START*/}
                  <div className="col-xl-12 col-lg-12 col-md-12"> 
                  { state.isRefresh && ( <SkeletonTask></SkeletonTask> ) }
                  { !state.isRefresh && ( <>
                    <CardCurrentTask txt_currentTask={state.currentTaskText} txt_startTime={currentTaskStartTime} sec={seconds} description={taskDescription} bgColor={state.currentTaskColor} textColor={state.currentTaskTextColor} icon={state.playStopIcon} startEndColor={state.playStopColor} isDisabled={state.isLoading} isEndTimeBlank={state.isEndTimeBlank} startTime={onclk_startTime} endTime={onclk_endTime} iconColor={state.currentTaskColor} clientName={currentTaskClient} /> {/* Container for Current task*/}
                    </> )
                  }
                  </div> 
              </div> {/* row #1 END */}

              <div className='row gx-4'> {/* row #2 START */}
                <div className='col-xl-12 col-lg-12 col-md-12'>
                    {/* Container for Timesheet <CardTimesheet/> */}
                    { state.isRefresh && ( <SkeletonTimesheet></SkeletonTimesheet> ) }
                    { !state.isRefresh && (
                      <>
                      <div className="card_general card_timesheet">
                        <div className='row gx-4'>
                          <div className=' col-md-8'>
                              <div className='d-flex'>
                                <p className='d-inline-flex txt_client'> CLIENT: </p>
                                <DropDown options={clientOptions} defaultValue={defaultOption} handleOnChange={e => setClient(e.value)} isDisabled={state.isLoading}  />
                                <DropDown options={timerangeOptions} defaultValue={timerangeOptions[0]} handleOnChange={ e => setTimerange(e.value)} isDisabled={state.isLoading}  />
                                
                                <p className='d-inline-flex txt_hawrs'> Total: {totalHours} HRS </p>
                                <span className='d-inline-flex txt_hawrs'> Average/Day: {averageHours} HRS  </span>
                              </div>
                            </div> 
                          <div className="d-flex flex-row-reverse col-md-4"> {/** row for button start */}
                            <CSVDownloader 
                                datas={timesheet_data}
                                filename={csvFilename}
                                target="_blank"
                                columns={columns}
                                disabled={state.isLoading || !timesheet_data?.length}
                                >
                                <button className='btn_download'  disabled={state.isLoading || !timesheet_data?.length}> <FaDownload/> </button>
                            </CSVDownloader>
                            <button className='btn_add_time'  disabled={state.isLoading || state.isAddTime || state.isEditable} onClick={onAddTime}> <FaPlus/> </button>
                            <h3 className='txt_general txt_today'>
                              {state.isLoading && (
                                <span className="spinner_loading">
                                  <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
                                </span>
                              )} 
                            <Clock 
                            style={{background: 'transparent'}}
                            format={'  dddd, MMMM D h:mm A'}
                            ticking={true}></Clock>
                            </h3>
                        </div> {/** row for button end */}
                      </div>

                      <div className='table_container' style={{visibility: 'visible'}}>
                        <table id="time_table">
                          <thead> {/*table head*/}
                            <tr>
                              {columns.map((col) => (
                                <th key={col.id}>{col.displayName}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody> {/*table body*/}
                            {timesheet_data.map((user, i) => (
                              <tr key={i}> 
                                {columns.map((col) =>   (
                                  <td key={col.id}>
                                    {!state.isEditable && user[col.accessor]}
                                    {state.isEditable && user.id != row_id && user[col.accessor]}
                                    {state.isEditable && user.id === row_id && col.id === 'duration' && user[col.accessor]}
                                    {state.isEditable && user.id === row_id && col.id === 'client_name' && (
                                       <DropDown options={actualClients} defaultValue={{label: user[col.accessor]}} 
                                       handleOnChange={ e => {
                                        user[col.accessor] = e.label;
                                        state.isEditing = true;
                                        setClientID(e.value);
                                       }
                                        
                                      } isDisabled={state.isLoading}  />
                                    )}
                                    {
                                      state.isEditable && user.id === row_id && col.id === 'start_time' && (
                                        <DatePicker 
                                          selected={new Date(user[col.accessor])}
                                          onChange={(date) => {
                                            var timetrackingDate = new TimetrackingDate();
                                            var utcDate = timetrackingDate.convertToUTC(date);
                                            user[col.accessor] = timetrackingDate.convertUTC(utcDate);
                                            const duration = getDuration(utcDate, endDate);
                                            user.duration = duration;
                                            state.isEditing = true;
                                            setDuration(duration);
                                            setStartDate(utcDate);
                                          }}
                                          className='datepicker'
                                          timeInputLabel="Start Time:"
                                          dateFormat="MMMM d, yyyy h:mm:ss aa"
                                          showTimeInput
                                          disabled={state.isLoading}
                                        />
                                     )
                                    }
                                    {
                                      state.isEditable && user.id === row_id && col.id === 'end_time' && (
                                        <DatePicker 
                                          selected={new Date(user[col.accessor])}
                                          onChange={(date) => {
                                            var timetrackingDate = new TimetrackingDate();
                                            var utcDate = timetrackingDate.convertToUTC(date);
                                            user[col.accessor] = timetrackingDate.convertUTC(utcDate);
                                            const duration = getDuration(startDate, utcDate);
                                            user.duration = duration;
                                            state.isEditing = true;
                                            setDuration(duration);
                                            setEndDate(timetrackingDate.convertToUTC(date));
                                          }}
                                          className='datepicker'
                                          timeInputLabel="End Time:"
                                          dateFormat="MMMM d, yyyy h:mm:ss aa"
                                          showTimeInput
                                          disabled={state.isLoading}
                                        />
                                     )
                                    }
                                    {
                                      state.isEditable && user.id === row_id && col.id === 'description' && (
                                        <>
                                           <textarea name="description" id="message" defaultValue={user[col.accessor]} 
                                                     className="timetable_textarea"  
                                                     required
                                                     disabled={state.isLoading}
                                                     onChange={e => {
                                                      user[col.accessor] = e.target.value;
                                                      setDescription(e.target.value);
                                                      state.isEditing = true;
                                                     }}
                                              />
                                        </>
                                      )
                                    }
                                    {
                                      col.id == 'buttons' && (
                                        <>
                                          <div>
                                            <button className='btn_save' onClick={() => onSave(user.id)} disabled={state.isLoading} style={{visibility: (state.isEditable && user.id != row_id) || (!state.isEditable) ? 'hidden' : 'visible'}}>
                                              <FaSave/>
                                             </button>
                                            <button className='btn_edit' onClick={ (!state.isEditable) || (state.isEditable && user.id != row_id) ? () => onEdit(user.id, user.start_time, user.end_time, user.client_id, user.client_name, user.description, user.duration) : () => onDiscard(user.id)} disabled={state.isLoading || (state.isEditing && user.id != row_id) || (state.isAddTime && user.id != row_id) || (state.isEndTimeBlank && user.id === lastRowData.id)}>
                                              {(!state.isEditable) || (state.isEditable && user.id != row_id) ? (<FaEdit/>) : (<FaTimes/>)}
                                             </button>
                                            <button className='btn_delete' onClick={() => confirmDeletion(user.id)} disabled={state.isLoading}>
                                              <FaTrash/>
                                             </button>
                                          </div>
                                        </>
                                      )
                                    }
                                  </td>                   
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div> 
                    </div> {/* end of timesheet container*/}
                    </>
                    )}
                </div> 
              </div> {/* row #2 END*/}
            </div> {/* time tracking main container END*/}
          </>   
        </InnerLayout>
        </>
      </CacheContext.Provider>
     );
}
 

export const getServerSideProps = getSessionCache();