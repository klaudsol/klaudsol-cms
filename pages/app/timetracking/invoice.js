import InnerLayout from '@/components/layouts/InnerLayout';
import { getSessionCache } from '@/lib/Session';
import CacheContext from '@/components/contexts/CacheContext';
import TimetrackingDate from '@/components/timetracking/TimetrackingDate'
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import Image from 'next/image';
import { GiRotaryPhone, GiArrowCursor } from 'react-icons/gi';
import { FaPlus, FaDownload, FaSave, FaTrash } from 'react-icons/fa';
import Dropdown from 'react-select'
import { slsFetch } from '@/components/Util'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DatePicker from "react-datepicker";
import Link from 'next/link';
import "react-datepicker/dist/react-datepicker.css";
import cx from 'classnames';
import styles from '@/styles/timetracking/Invoice.module.scss';

export default function Invoice({cache}) {

  // initilaize contents
  const initialState = {
    isLoading: false,
    isRefresh: true,
  };

  // developers table column
  const columns = [
    { column_name: "developer", displayName: "Developer"},
    { column_name: "start_time", displayName: "Start Time"},
    { column_name: "end_time", displayName: "End Time"},
    { column_name: "duration", displayName: "Duration (hours)" },
    { column_name: "description", displayName: "Description" },
  ];

  // developers table skeleton content
  const skeleton_timesheet = [
    {developer: "developer here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "developer here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "developer here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "developer here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "developer here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "developer here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
  ]

  // adjustments table skeleton content
  const skeleton_adjustments = [
    {column1: "Actual Hours Rendered", column2: "actual hours", column3: "Actual hours rendered by the developer"},
    {column1: "Total Hours", column2: "total hours", column3: "total hours rendered by the developer"},
  ]

  // using a reducer to change / alter UI when tasks are running / idle 
  const reducer = (state, action) => {
    switch(action.type) {
      case 'LOADING':
        return {
          ...state,
          isLoading: true,
        }
      case 'CLEANUP':
        return {
          ...state,
          isLoading: false,
          isRefresh: false,
        }
      default:
        return state;
    }
  }

  // initializing state for useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // initiliaze date
  let date_now = new Date();

  // invoice dates constants
  const [sentDate, setSentDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  // initialize invoice date using invoice_number_generator
  const [invoiceNumber, setInvoiceNumber] = useState();

  // variables for actualclients and default clients
  const [actualClients, setActualClients] = useState([]);
  const [defaultOptionModal, setDefaultOptionModal] = useState([]);
  const [currentClient, setCurrentClient] = useState([]);

  // list of invoice
  const [invoiceList, setInvoiceList] = useState([]);

  // variables to determine if dropdown / add buttons will show up (for choosing a client for bill to, choosing due date, adding banks, adding adjustment rows)
  const [isBillTo, setIsBillTo] = useState(false);
  const [isAddBank, setIsAddBank] = useState(false);
  const [isAddRow, setIsAddRow] = useState(false);
  const [isDueDate, setIsDueDate] = useState(false);
  const [isEditTotalHours, setIsEditTotalHours] = useState(false)
 
  // intialize hours, developers rate, total due
  const [developerRate, setDeveloperRate] = useState();
  const [totalDue, setTotalDue] = useState();
  const [totalHours, setTotalHours] = useState(0);

  // initialize arrays
  const [adjustmentsList, setAdjustmentsList] = useState([]);
  //const [timesheet_data, setTimesheetData] = useState([]);
  const [indexedTimesheetData, setIndexedTimesheetData] = useState({});

  // constant that lets ui updates to be automatically udpated
  const [change, setChange] = useState(true);

  // constant for getting coverate date (earleist to latest)
  const [lastDate, setLastDate] = useState();
  const [firstDate, setFirstDate] = useState();

  // initialzie bank list
  const [bankList, setBankList] = useState([]);

  // invoice number 
  const [invoiceCounter, setInvoiceCounter] = useState('2');
  
  //
  const onBillTo = (e) => {
      setCurrentClient({label: e.label, value: e.value, address: e.address, code: e.code, rate: e.rate});
      setDeveloperRate(parseFloat(e.rate))
  }

  const onChangeInvoiceList = (e) => {
   alert(e.value)
  }

  useEffect(() => {
    fetchData(currentClient.value, currentClient.rate, currentClient.code);
  }, [currentClient.value, currentClient.rate, currentClient.code]);
  
  useEffect(() => {
    
    const timesheetData = Object.values(indexedTimesheetData);
    const totalHours = getTotalHours(timesheetData).toFixed(4);
    setTotalHours(totalHours);  
    getTotalDue(totalHours, developerRate);
    
  }, [indexedTimesheetData]);


  const fetchData = useCallback((clientID, developerRate, clientCode) => {
    (async () => {
      try {
        dispatch({type: 'LOADING'});
        var timetracking_date = new TimetrackingDate();
        var client_id;
        var developer_rate;
        var previousInvoice;
        var nextInvoiceCounter;

        const banksRaw = await slsFetch('/api/app/timetracking/settings/get_banks');  
        const banks = await banksRaw.json();

        setBankList(banks);

        const fetchClients = await slsFetch('/api/app/timetracking/display_customers');  
        const clients = await fetchClients.json();

        let actual_clients = [];
        let default_client = [];

        actual_clients = clients.map((client) => {
          return {
            label: client.full_name,
            value: client.sme_customer_id,
            address: client.customer_address,
            code: client.code,
            rate: client.rate,
          }
        });

        default_client = clients.filter(client => client.is_default === true).map(client => {
          return {
                  label: client.full_name, 
                  value: client.sme_customer_id, 
                  address: client.customer_address,
                  code: client.code, 
                  rate: client.rate
               }
        })[0];

        setActualClients(actual_clients);
        setDefaultOptionModal(default_client);

        const invoicesRaw = await slsFetch(`/api/app/timetracking/invoice/get_invoices`);
        const invoices = await invoicesRaw.json();

        setInvoiceList(invoices.map(invoice => {
          return {
            label: invoice.invoice_number,
            value: invoice.invoice_number
          }
        }))

        
        if(!clientID){
            client_id = default_client.value;
            setCurrentClient(default_client);
            developerRate = parseFloat(default_client.rate);
            setDeveloperRate(parseFloat(default_client.rate));
            onInvoiceChange(default_client.code, dueDate, invoices);
        } else {
            client_id = clientID;
            developer_rate = developerRate;
            onInvoiceChange(clientCode, dueDate, invoices);
            setChange(!change);
        }

        const fetchDataParams = Object.fromEntries(
          Object.
            entries({client_id: client_id ?? null}).
            filter(([key, value]) => value)
        );
          
        const fetchData = await slsFetch(`/api/app/timetracking/invoice/invoiceables?${new URLSearchParams(fetchDataParams)}`);
        const timesheet_data = await fetchData.json();
  
          if(timesheet_data.length === 0){
            setIndexedTimesheetData({});
            getTotalDue(0,0);
          } else {
            
            
            //Use ID as an index for easier timesheet traversal and deletion
            setIndexedTimesheetData(
                timesheet_data.map(timesheet => (
                  {
                    ...timesheet,
                    developer: `${timesheet.first_name} ${timesheet.last_name}`,
                    start_time: timetracking_date.convertUTC(timesheet.start_time),
                    end_time: timetracking_date.convertUTC(timesheet.end_time)
                  }
                )).reduce((collector, timesheet) => (collector[timesheet.id] = timesheet, collector) , {})
            );
            
            getTotalDue(parseFloat(getTotalHours(timesheet_data)).toFixed(4), developerRate)
          }
          setFirstDate(timesheet_data.length != 0 ? timesheet_data[0].start_time : null);
          setLastDate(timesheet_data.length != 0 ? timesheet_data[timesheet_data.length - 1].end_time : null);
          //setTotalHours(timesheet_data.length != 0 ? getTotalHours(timesheet_data).toFixed(4) : 0);
          //initAdjustments(timesheet_data.length != 0 ? getTotalHours(timesheet_data) : 0);
          initAdjustments(0);
          
      } catch (ex) {
        console.error(ex.stack)
      } finally {
        dispatch({type: 'CLEANUP'});
      }
    })();
  }, [dueDate, invoiceCounter]);


  const getTotalHours = (timesheetData) => {
    return timesheetData.map((timesheet) => parseFloat(timesheet.duration) || 0).reduce((total, duration) => total + duration, 0)
  }

  const saveInvoice = useCallback(() => {
    (async () => {
      let timetracking_date = new TimetrackingDate();
      let rate = developerRate.toString();
      let total_amount = (developerRate * totalHours).toString();
      let coverage_start = timetracking_date.convertToUTC(firstDate);
      let coverage_end = timetracking_date.convertToUTC(lastDate);
      let sent_at = timetracking_date.convertToUTC(sentDate);
      let due_at = timetracking_date.convertToUTC(dueDate);

      //Note: This can be refactored further
      let client_id;
      if(currentClient.value == null){
        client_id = defaultOptionModal.value;
      } else {
        client_id = currentClient.value;
      }    
      
        try {
          dispatch({type: 'LOADING'});
          const ids = Object.keys(indexedTimesheetData);
          //TODO: This should be simply /api/app/timetracking/invoice
          const response = await slsFetch('/api/app/timetracking/invoice/create_invoice', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({invoiceNumber, client_id, rate, total_amount, coverage_start, coverage_end, sent_at, due_at, ids})
          })
          if (response.status === 200) alert("Invoice saved successfully.")
        } catch(ex) {
          alert(ex.stack);  
        } finally {
          dispatch({type: 'CLEANUP'});
          setInvoiceNumber("---");
        }
    })();
  }, [invoiceNumber, developerRate, totalHours, firstDate, lastDate, sentDate, dueDate]);

  const onSaveAdjustments = useCallback((label, man_hours, description) => {
    (async () => {

      let invoice_number = invoiceNumber;
      
        try {
          dispatch({type: 'LOADING'});
          const response = await slsFetch('/api/app/timetracking/invoice/create_adjustments', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({invoice_number, label, man_hours, description})
          })
        } catch(ex) {
          alert(ex.stack);  
        } finally {
          dispatch({type: 'CLEANUP'});
          setInvoiceNumber("---");
        }
    })();
  }, [invoiceNumber]);


  const onSaveInvoiceEntries = useCallback((invoiceNumber) => {
    let invoice_number = invoiceNumber;
    let client_id;
    if(currentClient.value == null){
      client_id = defaultOptionModal.value;
    } else {
      client_id = currentClient.value;
    }
    (async () => {
        try {
          dispatch({type: 'LOADING'});
          const response = await slsFetch('/api/app/timetracking/invoice/create_invoice_entries', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({client_id, invoice_number})
          })
          fetchData(currentClient.value);
        } catch(ex) {
          alert(ex.stack);  
        } finally {
          dispatch({type: 'CLEANUP'});
          setInvoiceNumber("---");
        }
    })();
  }, [currentClient.value, defaultOptionModal?.value]);

  const onInvoiceChange = (code, date, invoices) => {
    try {
      const previousInvoice = invoices.find(invoice => invoice.invoice_number.substring(0,3) === code)
      const nextInvoiceCounter = Number(previousInvoice.invoice_number.substring(3,6)) + 1;
      setInvoiceNumber(invoice_number_generator(code, nextInvoiceCounter.toString().padStart(3,'0'), date));
      setChange(!change);
    } catch(e) {
      setInvoiceNumber(invoice_number_generator(code, '001', date));
      setChange(!change);
    }
    
  }

  function initAdjustments(totalHours){
    let adjustment = [];
    //adjustment.push({label: "Actual Hours Rendered", man_hours: parseFloat(totalHours.toFixed(2)), description: "Actual hours rendered by the developer", isEditable: false})
    //adjustment.push({label: "Total Hours", man_hours: parseFloat(totalHours.toFixed(2)), description: "Total hours rendered by the developer", isEditable: false})
    setAdjustmentsList(adjustment);
  }

  // function to add bank 
  function addBank(bank){
    bank.push({bank_name: "Bank Name", account_name: "Account Name", account_type: "Account Type", account_number: "Account Number"})
    setBankList(bank);
    setChange(!change);
  }

  // function to add a row in adjustments table
  function addRow(adjustment){
    adjustment.pop();
    adjustment.push({label: null, man_hours: 0, description: null, isEditable: true, id: adjustment.length + 1})
    const finalHour = adjustment.map((hour) => hour.man_hours).reduce((prev, curr) => prev + curr);
    adjustment.push({label: "Total Hours: ", man_hours: finalHour, description: "Total hours rendered by the developer", isEditable: false, id: adjustment.length})
    //setTotalHours(finalHour);
    setAdjustmentsList(adjustment);
    setChange(!change);
  }

  // function to select the whole invoice
  function selectText(){
    var sel, range;
    var el = document.getElementById('div1'); //get element id
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
       window.setTimeout(function(){
        range = document.createRange(); //range object
        range.selectNode(el); //sets Range
        sel.removeAllRanges(); //remove all ranges from selection
        sel.addRange(range);//add Range to a Selection.
        //navigator.clipboard.read(sel).then(alert("COPIED!"));
      },1);
      }
    } else if (document.selection) { //older ie
      sel = document.selection.createRange();
      if(sel.text == ''){ //no text selection
        range = document.body.createTextRange();//Creates TextRange object
        range.moveToElementText(el);//sets Range
        range.select(); //make selection.
      }
    }
  }

  // function that triggers when developer's rate is changed
  const handleRateChange = (e) => {
    setDeveloperRate(e.target.value);
    getTotalDue(totalHours, e.target.value);
  }

  // function that triggers when totalHours is changed
  const handleHourChange = (e) => {
    //setTotalHours(e.target.value);
    getTotalDue(e.target.value, developerRate);
  }

  /* function that computes final hours -- to be fixed
  const getFinalHours = (adjustmentList) => {
    const finalHours = adjustmentList.map((hour) => hour.column2);
    const finalHour = finalHours.reduce((prev, curr) => prev + curr);
    setTotalHours(finalHour);
  } */

  // function that computes the total amount (totalHours x developerRate)
  //Rename this, this is a misnomer!
  function getTotalDue(totalHours, developerRate){
    setTotalDue((developerRate * totalHours).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }

  // function that generates a random invoice number
  function invoice_number_generator(code, counter, dueDate){
    let due = new Date(dueDate);
    return code + due.getFullYear () + ("0" + (due.getMonth()+1)).slice(-2) + ("0" + (due.getDate())).slice(-2);
  }

  // function that generates a pdf 
  function generatePDF() {
    html2canvas(document.getElementById('div1'), {
      useCORS: true, allowTaint: true, scrollY: 0,
    }).then(canvas => {
      const image = { type: 'jpeg', quality: 0.98 };
      const margin = [1, 1];
      const filename = 'test-invoice.pdf';

      var imgWidth = 8.5;
      var pageHeight = 11;

      var innerPageWidth = imgWidth - margin[0] * 2;
      var innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
      var pxFullHeight = canvas.height;
      var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      var nPages = Math.ceil(pxFullHeight / pxPageHeight);

      // Define pageHeight separately so it can be trimmed on the final page.
      var pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      var pageCanvas = document.createElement('canvas');
      var pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      var pdf = new jsPDF('p', 'in', [8.5, 11]);

      for (var page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        var w = pageCanvas.width;
        var h = pageCanvas.height;
        pageCtx.fillStyle = 'white';
        pageCtx.fillRect(0, 0, w, h);
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        debugger;
        var imgData = pageCanvas.toDataURL('image/' + image.type, image.quality);
        pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
      }

      pdf.save(filename);
    });
  }

  function save(){
    saveInvoice();
    //adjustmentsList.map(adjustment => onSaveAdjustments(adjustment.label, adjustment.man_hours.toString(), adjustment.description))
    //onSaveInvoiceEntries(invoiceNumber)
  }
  
  const TimesheetEntry = ({timesheet_entry}) => { 
      const [visible, setVisible] = useState(false);
      
      const onDelete = (timesheet_entry) => {
      
        console.error(`Deleting ${timesheet_entry.id}`);  
        setIndexedTimesheetData(indexedTimesheetData => {
          
          //remove timesheet_entry.id from the hash
          const { [timesheet_entry.id]: remove, ...rest} = indexedTimesheetData;
          return rest;
          
        });
        
      };
    
      return (
        <tr key={timesheet_entry.id} className={cx(styles.row)}> 
            <td> {timesheet_entry.developer} </td>
            <td> {timesheet_entry.start_time} </td>
            <td> {timesheet_entry.end_time} </td>
            <td> {timesheet_entry.duration} </td>
            <td className={styles.buttonsColumn}> 
              {timesheet_entry.description} 
              <button 
                className={cx('btn_delete', styles.buttonDelete, styles.buttonDeleteVisible)}
                onClick={() => onDelete(timesheet_entry)}
              >
                <FaTrash/>
              </button>
            </td>
        </tr>
      );
  }

  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout> 
        <>
        <div className='container_fluid d-flex align-items-center justifiy-content-center row'>
          <div className='container text-center container_invoice_buttons'>
            <button className='btn btn-success btn_download_pdf' onClick={generatePDF} disabled={state.isLoading}> <FaDownload/>  </button>
            <button   className='btn btn-success btn_select_all'  onClick={selectText} disabled={state.isLoading}> <GiArrowCursor/></button>
            <button   className='btn btn-success btn_select_all'  onClick={save} disabled={state.isLoading}> <FaSave/></button>
            
            <Link href='/app/timetracking/invoice/lists'> 
              <button className='btn btn-success btn_select_all' disabled={state.isLoading}> List of Invoices </button>
            </Link>
            
            <Link href='/app/timetracking/professional_fee'> 
              <button className='btn btn-success btn_select_all' disabled={state.isLoading}> Professional Fee </button>
            </Link>
            
          </div>
         
          <div contentEditable={true} className='container_invoice_2 container' id="div1">
                {/* CONTAINER FOR KLAUDSOL HEADER */}
                <div className='container text-center'>
                  <Image src="/logo-180x180.png" width="180" height="80" className='img-responsive img_klaudsol' alt='logo' />
                  <p className='invoice_txt_general'>  
                    KlaudSol Philippines, Inc <br></br>
                    Level 10-01 One Global Place 5th Avenue &amp; 25th Street <br></br>
                    Bonifacio Global City, Taguig, Metro Manila <br></br>
                    SEC - CS2019-11875 TIN - 010-362-703-000 <br></br>
                    <GiRotaryPhone/> 7618-5109 / <GiRotaryPhone/> 8809-1044
                  </p>
                </div>

                {/* INVOICE - DATE */}
                <div className='text-center container_invoice_date container'>
                  <h3 className='invoice_txt_header'> Invoice - {state.isRefresh && (<b className='invoice_skeleton_title' style={{fontSize: 12}}>{dueDate.toDateString()}</b>)}
                               {!state.isRefresh && (<>{dueDate.toDateString()}</>)}
                  </h3>
                </div>

                {/* INVOICE - (INVOICE NUMBER, COVERAGE, DATE SENT, DUE DATE) */}
                <div className='container' onMouseOver={() => setIsDueDate(true)} onMouseLeave={() => setIsDueDate(false)}>
                    <p className='invoice_txt_general'> 

                    Invoice Number:  {state.isLoading && ( <><b className='invoice_skeleton_p_text'>Invoice number here</b></>)}
                                     {!state.isLoading && isDueDate && (
                                       <input className='input_developer_rate' style={{width: 'max-content'}} type="text" defaultValue={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)}/>
                                      )}
                                     {!state.isLoading && !isDueDate && invoiceNumber} <br></br>
                   
                    Coverage: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Coverage date from - to here</b></>)}
                              {!state.isLoading  && ( <b> {firstDate ? new Date(firstDate).toDateString() : "-"} - {lastDate ? new Date(lastDate).toDateString() : "-"}</b> )}<br></br>

                    <div className='d-flex flex-row m-0 p-0'>
                    Sent: &nbsp; {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Sent date displayed</b></>)}
                        <b>{!state.isRefresh && !isDueDate && sentDate.toDateString()}</b> {!state.isRefresh && isDueDate && (
                          <>
                            <DatePicker 
                              selected={sentDate}
                              onChange={(date) => {
                                setSentDate(date);
                                setChange(!change);
                              }}
                              className='invoice_datepicker'
                              dateFormat="MMMM d, yyyy"
                              disabled={state.isLoading}
                              />
                        </>
                      )}
                    </div>
                    
                    <div className='d-flex flex-row m-0 p-0'>
                      Due: &nbsp; {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Due date displayed</b></>)}
                        <b>{!state.isRefresh && !isDueDate && dueDate.toDateString()}</b> {!state.isRefresh && isDueDate && (
                          <>
                            <DatePicker 
                              selected={dueDate}
                              onChange={(date) => {
                                setDueDate(date);
                                setInvoiceNumber(invoice_number_generator(currentClient.code, invoiceCounter.padStart(3,'0'), date));
                                setChange(!change);
                              }}
                              className='invoice_datepicker'
                              dateFormat="MMMM d, yyyy"
                              disabled={state.isLoading}
                              />
                        </>
                      )}
                    </div>
                    
                    </p>
                </div>

                {/* BILL TO CONTAINER */}
                <div className='container_bill_to container' onMouseOver={() => setIsBillTo(true)} onMouseLeave={() => setIsBillTo(false)}>
                    {/* FOR CHOOSING CLIENTS */}
                    <div className='d-flex flex-row'>
                    <p className='invoice_txt_bill_to'>Bill to: </p>
                    {isBillTo && !state.isLoading && (
                      <>
                         <Dropdown options={actualClients} defaultValue={currentClient}
                                    onChange={onBillTo}
                                    isClearable={false}
                                    isSearchable={false}
                                    isDisabled={false}
                                    styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      '&:hover': { borderColor: 'gray' }, // border style on hover
                                      border: '1px solid lightgray', // default border color
                                      boxShadow: 'none', // no box-shadow
                                      marginRight: '5px',
                                      fontSize: '10px',
                                      height: 8,
                                      padding: 0,
                                      }),
                                      menu: (base, state) => ({
                                        ...base,
                                        fontSize: '10px',
                                        }),
                                  }} 
                          /> 
                      </>
                    )}
                    </div>
                    {/* FOR SHOWING CLIENT DATA */}       
                    <div className="col-6">
                    <p className='invoice_txt_general'> 
                      {state.isLoading  && ( <><b className='invoice_skeleton_title'>Name of client here:</b><br></br>
                                            <b className='invoice_skeleton_text'>The complete address of client will be shown in this particular component and it will automatically adjust no matter how long the address is</b><br></br></>)}
                      {!state.isLoading  && (<><b>{currentClient.label}</b> <br></br>
                                               {currentClient.address} <br></br>
                                          </>)}
                    </p>
                    </div>
                </div>

                {/* SUMMARY CONTAINER */} 
                <div className='container_header container'>
                  <p className='invoice_txt_header'> <br></br> Summary: </p>
                  <div className='invoice_bar'></div>
                   {/* SUMMARY TABLE */}
                  <div className='invoice_table_container d-flex justify-content-center' onMouseOver={() => setIsEditTotalHours(true)} onMouseLeave={() => setIsEditTotalHours(false)}>
                    <table id='summary_table' contentEditable={false}>
                      <tbody>
                        <tr>  {/* ROW # 1 SOFTWARE SERVICES*/}
                          <td>Software Services</td>
                          <td  >
                            <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                              {state.isLoading && ( <><b className='invoice_skeleton_p_title'>hours</b></>)}
                              {!state.isLoading && isEditTotalHours && (
                                 <input className='input_developer_rate' style={{width: '30px'}} type="text" defaultValue={totalHours} onChange={handleHourChange}/>
                              )}
                              {!state.isLoading && !isEditTotalHours && totalHours} man-hour
                             </div>
                          </td>
                          <td>
                            <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                              &nbsp; &#8369;
                              {state.isLoading && ( <><b className='invoice_skeleton_p_title'>hours</b></>)}
                              {!state.isLoading && isEditTotalHours && (
                                 <input className='input_developer_rate' style={{width: '30px'}} type="text" defaultValue={developerRate} onChange={handleRateChange}/>
                              )}
                              {!state.isLoading  && !isEditTotalHours && developerRate} /hour
                            </div>
                          </td>
                          <td className='txt_total_due'>&#8369;
                              {state.isLoading &&  ( <><b className='invoice_skeleton_p_title'>total due</b></>)}
                              {!state.isLoading  && totalDue}</td>
                          </tr>
                        <tr> {/* ROW # 2 TOTAL DUE */}
                          <td>Total Due:</td> 
                          <td></td>
                          <td></td>
                          <td className='txt_total_due'><b>&#8369;
                            {state.isLoading && ( <><b className='invoice_skeleton_p_title'>total due</b></>)}
                            {!state.isLoading  && totalDue}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className='container_header container' onMouseOver={() => setIsAddBank(true)} onMouseLeave={() => setIsAddBank(false)}>
                  <div className='d-flex flex-row'>
                    <p className='invoice_txt_header'> <br></br>Mode of Payment: Deposit Online or Transfer to the following banks: </p>
                    {isAddBank  && !state.isLoading &&  (
                      <>
                        <button onClick={() => addBank(bankList)} className='btn btn_add'><FaPlus/></button>
                      </>
                    )}
                    </div>
                
                <div className='invoice_bar'></div>

                <div className='row container_payment d-flex justify-content-center container'>

                  <div className='invoice_table_container d-flex justify-content-center' onMouseOver={() => setIsEditTotalHours(true)} onMouseLeave={() => setIsEditTotalHours(false)}>
                    <table id='bank_table'>
                    <tbody>
                      <tr>
                      {bankList.map((bank, i) => (
                        <td key={i}> 
                          {state.isRefresh && ( <><b className='invoice_skeleton_p_title'>Bank Name</b></>)}
                          <b>{!state.isRefresh && bank.bank_name}</b> <br></br> 

                          {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Account Name</b></>)}
                          {!state.isRefresh && bank.account_name} <br></br> 

                          {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Account Number</b></>)}
                          {!state.isRefresh && bank.account_number} <br></br> 
                                
                          {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Account Type</b></>)}
                          {!state.isRefresh && bank.account_type} 
                        </td>
                      ))}
                      </tr>
                    
                    </tbody>
                    </table>
                  </div>
                </div>
                
                
                </div>

                <div className='container_header container'>
                  <p className='invoice_txt_header'> Details: </p>
                  <div className='invoice_bar'></div>

                  <div className='developers_table_container container d-flex justify-content-center'>
                      <table id='developers_table' contentEditable={false}>
                      <thead>
                      <tr>
                          {columns.map((col) => (
                      <th key={col.column_name} className="text-center">{col.displayName}</th>
                      ))}
                      </tr>
                      </thead>
                      <tbody>
                      
                          {state.isLoading  && skeleton_timesheet.map((user, i) => (
                            <tr key={i}> 
                                {columns.map((col,i) =>   (
                                <td key={i}> 
                                  <><b className='invoice_skeleton_p_text'>{user[col.column_name]}</b></>
                                </td>))}
                            </tr>
                          ))}
                          
                          {!state.isLoading  && Object.values(indexedTimesheetData).map((timesheet_entry) => ( 
                          
                            <TimesheetEntry key={timesheet_entry.id} timesheet_entry={timesheet_entry} />
                            
                          ))}
                      </tbody>
                      </table>
                  </div>
                
                  <div className='container_header container' onMouseOver={() => setIsAddRow(true)} onMouseLeave={() => setIsAddRow(false)}>
                  <div className='d-flex flex-row'>
                    <p className='invoice_txt_header'> <br></br>Adjustments: </p>
                    {isAddRow && (
                      <>
                        <button onClick={() => addRow(adjustmentsList)} className='btn btn_add'><FaPlus/></button>
                      </>
                    )}
                    </div>
                
                <div className='invoice_bar'></div>
                  

                  <div className='invoice_table_container d-flex justify-content-center' onMouseOver={() => setIsEditTotalHours(true)} onMouseLeave={() => setIsEditTotalHours(false)}>
                  <table id='details_table' contentEditable={true}>
                  <tbody>
                        {state.isLoading && skeleton_adjustments.map((user,i) => (
                          <tr key={i}> 
                              <td><><b className='invoice_skeleton_p_text'>{user.column1}</b></></td>
                              <td>
                                <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                                <><b className='invoice_skeleton_p_text'>{user.column2}</b></> &nbsp;
                                  man-hours
                                </div>
                              </td>
                              <td> <><b className='invoice_skeleton_p_text'>{user.column3}</b></></td>
                          </tr>))}
                          
                        {!state.isLoading && (
                          <tr>
                            <td>Actual hours rendered</td>
                            <td>{totalHours} man-hours</td>
                            <td>Actual hours rendered by the developer</td>
                          </tr>
                        
                        
                        )}
                        {!state.isLoading  && adjustmentsList.map((user,i) => (
                          <tr key={i}> 
                              <td>
                              {!state.isLoading && isEditTotalHours && user.isEditable && (
                                 <input className='input_developer_rate' style={{width: '70px'}} type="text" defaultValue={user.label} 
                                 onChange={
                                   e => {
                                     user.label = e.target.value;
                                   }
                                 }/>
                                  )}
                                  {user.label} 
                              </td>
                              <td>
                                <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                                {!state.isLoading && isEditTotalHours && user.isEditable && (
                                 <input className='input_developer_rate' style={{width: '30px'}} type="text"  defaultValue={user.man_hours} 
                                 onChange={
                                   e => {
                                     user.man_hours = e.target.value;
                                   }
                                 }/>
                                  )}
                                  {user.man_hours} &nbsp;
                                  man-hours
                                </div>
                              </td>
                              <td> 
                              {!state.isLoading && isEditTotalHours && user.isEditable && (
                                 <input className='input_developer_rate' style={{width: '70px'}} type="text" defaultValue={user.description} 
                                 onChange={
                                   e => {
                                     user.description = e.target.value;
                                   }
                                 }/>
                                  )}
                                {user.description}</td>
                          </tr>))}
                      </tbody>
                  </table>
                  </div>
                  </div>

                </div>
                
            </div>

               
        </div>
        </>   
      </InnerLayout>
    </CacheContext.Provider>
  );
  
}

export const getServerSideProps = getSessionCache();
