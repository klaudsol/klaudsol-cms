import { useEffect, useState, useCallback } from 'react';
import { getSessionCache } from '@/lib/Session';
import CacheContext from '@/components/contexts/CacheContext';
import InnerLayout from '@/components/layouts/InnerLayout';
import DropDown from '@/components/timetracking/DropDown';
import { FaTrash, FaPlay, FaStop, FaDownload, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import Clock from 'react-live-clock';
import { slsFetch } from '@/components/Util'; 
import TimetrackingDate from '@/components/timetracking/TimetrackingDate';
import SkeletonTask from '@/components/timetracking/SkeletonTask';
import SkeletonTimesheet from '@/components/timetracking/SkeletonTimesheet';
import DatePicker from "react-datepicker";

export default function Report({cache}) {
    const state = {};
    const columns = [
        { id: "team_member", displayName: "Team Member", accessor: "team_member" },
        { id: "start_time", displayName: "Start Time", accessor: "start_time" },
        { id: "end_time", displayName: "End Time", accessor: "end_time" },
        { id: "duration", displayName: "Duration", accessor: "duration" },
        { id: "client_name", displayName: "Client", accessor: "client_name" },
        { id: "description", displayName: "Description", accessor: "description" },
        { id: "buttons", displayName: "", accessor: "" },
    ];
    
    
    const onAddTime = () => {};
    const defaultOption = null;
    const defaultOptionFor = (label) => [{label, value: null}];
    const defaultOptionForClient = defaultOptionFor("All Clients");
    const defaultOptionForTeamMembers = defaultOptionFor("All Team Members");
    const DEFAULT_ALL_OPTION = [{label: '(All)', value: null}];
    const DECIMAL_PRECISSION = 4;
    
    //refactor as static instead
    const timetracking_date = new TimetrackingDate();
    
    const [clientOptions, setClientOptions] = useState(defaultOptionForClient);
    const [teamMemberOptions, setTeamMemberOptions] = useState(defaultOptionForTeamMembers);
    const [timesheetData, setTimesheetData] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [peopleId, setPeopleId] = useState(null);
    const [invoiceId, setInvoiceId] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [averageHours, setAverageHours] = useState(0);
    
    const timeOptions = [
      {label: "All Time", value: null},
      {label: "Today", value: "today"},
    ];
    
    const invoiceOptions = [
      {label: "Invoiced + Uninvoiced", value: null},
      {label: "Invoiced", value: "__invoiced__"},
      {label: "Uninvoiced", value: "__uninvoiced__"},
    ];
    
    const paymentOptions = [
      {label: "Paid + Unpaid", value: null},
      {label: "Payment# 070000", value: "070000"},
      {label: "Payment# 070001", value: "070000"},
      {label: "Unpaid", value: "__uninvoiced__"},
    ];
    
    const ratesVisibilityOptions = [
      {label: "Hide Rates", value: null},
      {label: "Display Rates", value: "true"}
    ];
    
    const clientOnChange = useCallback((e) => {
      setClientId(e.value); 
    }, [setClientId]);
    
    const peopleOnChange = useCallback((e) => {
      setPeopleId(e.value); 
    }, [setPeopleId]);
    
    const invoiceOnChange = useCallback((e) => {
      setInvoiceId(e.value); 
    }, [setInvoiceId]);
    
    /*** Customers list ***/
    useEffect(() => { 
      (async () => {
        
        const customersRaw = await slsFetch('/api/app/timetracking/display_customers');  
        const customers = await customersRaw.json();
        setClientOptions(
          [
            ...defaultOptionForClient,
            ...customers.map(customer => {
              return {
                value: customer.sme_customer_id,
                label: customer.display_name
              }
            })
          ]
        );
        console.error(customers);
        
      })();
    }, []);

    /*** Team members list ***/
    useEffect(() => { 
      (async () => {
        
        const teamMembersRaw = await slsFetch('/api/core/people');  
        const teamMembers = await teamMembersRaw.json();
        setTeamMemberOptions(
          [
            ...defaultOptionForTeamMembers,
            ...teamMembers.map(teamMember => {
              return {
                value: teamMember.id,
                label: `${teamMember.first_name} ${teamMember.last_name}`
              }
            })
          ]
        );
        
      })();
    }, []);
    
    /*** Timesheet ***/
    useEffect(() => { 
      (async () => {
        
        //Remove null parameters
        const fetchDataParams = Object.fromEntries(
          Object.entries({
            client_id: clientId ?? null,
            peopleId,
            invoiceId
          }).
          filter(([key, value]) => value)
        );
        
        const reportsRaw = await slsFetch(`/api/app/timetracking/reports?${new URLSearchParams(fetchDataParams)}`);  
        const reports = await reportsRaw.json();
        setTimesheetData(reports.map(report => {
          return {
            ...report,
            team_member: `${report.first_name} ${report.last_name}`,
            start_time: timetracking_date.convertUTC(report.start_time),
            end_time: timetracking_date.convertUTC(report.end_time)
          }
        }));
        const _totalHours = reports.map(report => +(report.duration ?? 0)).reduce((sum, duration) => sum + duration, 0) ?? 0;
        const startTimeDates = reports.map((report) => new Date(report.start_time).toLocaleDateString());
        const uniqueStartTimeDates = [...new Set(startTimeDates)];
        setTotalHours(_totalHours.toFixed(DECIMAL_PRECISSION));
        setAverageHours((_totalHours / uniqueStartTimeDates.length).toFixed(DECIMAL_PRECISSION));
      
        
      })();
    }, [clientId, peopleId, invoiceId]);
    
    return (
    <CacheContext.Provider value={cache}>
     <>
        <InnerLayout> 
          <>
            <div className='container-fluid'> {/* time tracking main container START*/}
              <div className='row gx-4'> {/* row #1 START*/}
                  <div className="col-xl-12 col-lg-12 col-md-12"> 
                  { state.isRefresh && ( <SkeletonTask></SkeletonTask> ) }
                  { !state.isRefresh && ( <>
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
                          <div className=' col-md-12'>
                              <div className='d-flex'>
                                <DropDown style={{width: '1200px'}} options={clientOptions} defaultValue={clientOptions[0]} handleOnChange={clientOnChange} isDisabled={state.isLoading}  />
                                
                                <DropDown options={teamMemberOptions} defaultValue={teamMemberOptions[0]} handleOnChange={peopleOnChange} />
                                
                                {/*<DropDown options={timeOptions} defaultValue={timeOptions[0]} />*/}
                                
                                <DropDown options={invoiceOptions} defaultValue={invoiceOptions[0]} handleOnChange={invoiceOnChange}/>
                                
                                {/*<DropDown options={paymentOptions} defaultValue={paymentOptions[0]} />*/}
                                
                                {/*<DropDown options={ratesVisibilityOptions} defaultValue={ratesVisibilityOptions[0]} />*/}
                                
                              </div>
                            </div> 
                          
                          <div className="d-flex flex-row-reverse col-md-4"> {/** row for button start */}
                            {/*
                            <CSVDownloader 
                                datas={timesheet_data}
                                filename={csvFilename}
                                target="_blank"
                                columns={columns}
                                disabled={state.isLoading || !timesheet_data?.length}
                                >
                                <button className='btn_download'  disabled={state.isLoading || !timesheet_data?.length}> <FaDownload/> </button>
                            </CSVDownloader>
                            */}
                            {/*<button className='btn_add_time'  disabled={state.isLoading || state.isAddTime || state.isEditable} onClick={onAddTime}> <FaPlus/> </button>*/}
                            <h3 className='txt_general txt_today'>
                              {state.isLoading && (
                                <span className="spinner_loading">
                                  <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
                                </span>
                              )} 
                            {/*
                            <Clock 
                            style={{background: 'transparent'}}
                            format={'  dddd, MMMM D h:mm A'}
                            ticking={true}></Clock>
                            */}
                            </h3>
                        </div> {/** row for button end */}
                      </div>
                      
                      <div className='row gx-4'>
                          <p className='d-inline-flex txt_hawrs'> Total: {totalHours} HRS </p>
                          <span className='d-inline-flex txt_hawrs'> Average/Day: {averageHours} HRS  </span>
                      </div>

                      <div className='table_container' style={{visibility: 'visible'}}>
                        <table id="time_table" className='time_table--reports'>
                          <thead> {/*table head*/}
                            <tr>
                              {columns.map((col) => (
                                <th key={col.id}>{col.displayName}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody> {/*table body*/}
                            {timesheetData.map((user, i) => (
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
                                    {/*
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
                                    */}
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