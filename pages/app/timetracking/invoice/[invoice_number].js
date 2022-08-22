import InnerLayout from '@/components/layouts/InnerLayout';
import { getSessionCache } from '@/lib/Session';
import CacheContext from '@/components/contexts/CacheContext';
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { slsFetch } from '@/components/Util'; 
import Link from 'next/link';
import { useRouter } from 'next/router';
import TimetrackingDate from '@/components/timetracking/TimetrackingDate';
import Image from 'next/image';
import { GiRotaryPhone, GiArrowCursor } from 'react-icons/gi';
import { FaPlus, FaDownload, FaSave } from 'react-icons/fa';

export default function Invoice({cache}) {
    const router = useRouter();
    const { invoice_number } = router.query;

    const [invoice, setInvoice] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [invoiceEntriesList, setInvoiceEntriesList] = useState([]);
    const [adjustmentsList, setAdjustmentsList] = useState([]);
    const [client, setClient] = useState([]);

    const timetracking_date = new TimetrackingDate();

    
  // developers table column
  const columns = [
    { column_name: "developer", displayName: "Developer" },
    { column_name: "start_time", displayName: "Start Time" },
    { column_name: "end_time", displayName: "End Time" },
    { column_name: "duration", displayName: "Duration (hours)" },
    { column_name: "description", displayName: "Description" },
  ];

  // developers table skeleton content
  const skeleton_timesheet = [
    {developer: "first name here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "first name here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "first name here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "first name here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "first name here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
    {developer: "first name here", start_time: "start_time date", end_time: "end_time date", duration: "duration", description: "the description of each task here"},
  ]

  const skeleton_adjustments = [
    {label: "Actual Hours Rendered", man_hours: "actual hours", description: "Actual hours rendered by the developer"},
    {label: "Total Hours", man_hours: "total hours", description: "total hours rendered by the developer"},
  ]



    const initialState = {
        isLoading: false,
      };

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
            }
          default:
            return state;
        }
      }

    const [state, dispatch] = useReducer(reducer, initialState);
    
    /* app_timetracking_invoices */
    useEffect(() => { 
        (async () => {
            try {
                dispatch({type: 'LOADING'});

                const banksRaw = await slsFetch('/api/app/timetracking/settings/get_banks');  
                const banks = await banksRaw.json();

                setBankList(banks);
        
                const invoicesRaw = await slsFetch(`/api/app/timetracking/invoices/${invoice_number}`);
                const invoice = await invoicesRaw.json();
                
                setInvoice({
                      ...invoice, 
                      coverage_start: timetracking_date.convertUTC(invoice.coverage_start),
                      coverage_end: timetracking_date.convertUTC(invoice.coverage_end),
                      sent_at: timetracking_date.convertUTC(invoice.sent_at),
                      due_at: timetracking_date.convertUTC(invoice.due_at),
                      total_amount: parseFloat(invoice.total_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                });

              const fetchDataParams = Object.fromEntries(
                Object.
                  entries({invoice_number: invoice_number ?? null}).
                  filter(([key, value]) => value)
              );
                

                const invoiceEntriesRaw = await slsFetch(`/api/app/timetracking/invoice/get_invoice_entries?${new URLSearchParams(fetchDataParams)}`);
                const invoiceEntries = await invoiceEntriesRaw.json();
                
                setInvoiceEntriesList(invoiceEntries.map(entry => {
                  return {
                    ...entry,
                    developer: `${entry.first_name} ${entry.last_name}`,
                    start_time: timetracking_date.convertUTC(entry.start_time),
                    end_time: timetracking_date.convertUTC(entry.end_time)
                  }
                }))

                const clientsRaw = await slsFetch('/api/app/timetracking/display_customers');  
                const clients = await clientsRaw.json();
                const client_id = invoiceEntries[0].client_id;

                setClient(clients.filter(client => client.sme_customer_id === client_id)[0])

    

                const adjustmentsRaw = await slsFetch(`/api/app/timetracking/invoice/get_invoice_adjustments?${new URLSearchParams(fetchDataParams)}`);
                const adjustments = await adjustmentsRaw.json();

                setAdjustmentsList(adjustments);
                
              } catch (ex) {
                alert(ex.stack)
              } finally {
                dispatch({type: 'CLEANUP'});
              }
            
        })();
      }, [invoice_number]); 

  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout> 
        <>
        <div className='container_fluid d-flex align-items-center justifiy-content-center row'>
          <div className='container text-center container_invoice_buttons'>
            <Link href='/app/timetracking/invoice/lists'> 
                <button className='btn btn-success btn_select_all' disabled={state.isLoading}> Go back</button>
            </Link>
          </div>
         
          <div className='container_invoice_2 container' id="div1">
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
                  <h3 className='invoice_txt_header'> Invoice - {state.isRefresh && !invoice.due_at && (<b className='invoice_skeleton_title' style={{fontSize: 12}}>{invoice.due_at}</b>)}
                               {!state.isRefresh && invoice.due_at && (<>{new Date(invoice.due_at).toDateString()}</>)}
                  </h3>
                </div>

                {/* INVOICE - (INVOICE NUMBER, COVERAGE, DATE SENT, DUE DATE) */}
                <div className='container'>
                    <p className='invoice_txt_general'> 

                    Invoice Number:  {state.isLoading && ( <><b className='invoice_skeleton_p_text'>Invoice number here</b></>)}
                                     {!state.isLoading && invoice.invoice_number} <br></br>
                   
                    Coverage: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Coverage date from - to here</b></>)}
                              {!state.isLoading  && ( <b> {new Date(invoice.coverage_start).toDateString()} - {new Date(invoice.coverage_end).toDateString()}</b> )}<br></br>

                    <div className='d-flex flex-row m-0 p-0'>
                    Sent: &nbsp; {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Sent date displayed</b></>)}
                        <b>{!state.isRefresh && new Date(invoice.sent_at).toDateString()}</b> 
                    </div>
                    
                    <div className='d-flex flex-row m-0 p-0'>
                      Due: &nbsp; {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Due date displayed</b></>)}
                        <b>{!state.isRefresh && new Date(invoice.due_at).toDateString()}</b> 
                    </div>
                    
                    </p>
                </div>

                {/* BILL TO CONTAINER */}
                <div className='container_bill_to container'>
                    {/* FOR CHOOSING CLIENTS */}
                    <div className='d-flex flex-row'>
                        <p className='invoice_txt_bill_to'>Bill to: </p>
                    </div>
                    {/* FOR SHOWING CLIENT DATA */}       
                    <div className="col-6">
                    <p className='invoice_txt_general'> 
                      {state.isLoading  && ( <><b className='invoice_skeleton_title'>Name of client here:</b><br></br>
                                            <b className='invoice_skeleton_text'>The complete address of client will be shown in this particular component and it will automatically adjust no matter how long the address is</b><br></br></>)}
                      {!state.isLoading  && (<><b>{client.full_name}</b> <br></br>
                                               {client.customer_address} <br></br>
                                          </>)}
                    </p>
                    </div>
                </div>

                {/* SUMMARY CONTAINER */} 
                <div className='container_header container'>
                  <p className='invoice_txt_header'> <br></br> Summary: </p>
                  <div className='invoice_bar'></div>
                   {/* SUMMARY TABLE */}
                  <div className='invoice_table_container d-flex justify-content-center'>
                    <table id='summary_table'>
                      <tbody>
                        <tr>  {/* ROW # 1 SOFTWARE SERVICES*/}
                          <td>Software Services</td>
                          <td  >
                            <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                              {state.isLoading && ( <><b className='invoice_skeleton_p_title'>hours</b></>)}
                              {!state.isLoading && ( 
                                <>
                                  {invoice.total_hours} man-hours
                                </>
                              )}
                             </div>
                          </td>
                          <td>
                            <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                              &nbsp; &#8369;
                              {state.isLoading && ( <><b className='invoice_skeleton_p_title'>hours</b></>)}
                              {!state.isLoading   && invoice.rate} /hour
                            </div>
                          </td>
                          <td className='txt_total_due'>&#8369;
                              {state.isLoading &&  ( <><b className='invoice_skeleton_p_title'>total due</b></>)}
                              {!state.isLoading  && invoice.total_amount}</td>
                          </tr>
                        <tr> {/* ROW # 2 TOTAL DUE */}
                          <td>Total Due:</td> 
                          <td></td>
                          <td></td>
                          <td className='txt_total_due'><b>&#8369;
                            {state.isLoading && ( <><b className='invoice_skeleton_p_title'>total due</b></>)}
                            {!state.isLoading  && invoice.total_amount}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MODE OF PAYMENT CONTAINER */} 
                <div className='container_header container'>
                  <p className='invoice_txt_header'> <br></br>Mode of Payment: Deposit Online or Transfer to the following banks: </p>
                  <div className='invoice_bar'></div>

                  <div className='row container_payment d-flex justify-content-center container'>
                    <div className='invoice_table_container d-flex justify-content-center'>
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

                {/* DETAILS */}
                <div className='container_header container'>
                  <p className='invoice_txt_header'> Details: </p>
                  <div className='invoice_bar'></div>

                  <div className='developers_table_container container d-flex justify-content-center'>
                      <table id='developers_table'>
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
                          </tr>))}
                          {!state.isLoading  && invoiceEntriesList.map((user, i) => (
                          <tr key={i}> 
                              {columns.map((col,i) =>   (
                              <td key={i}> 
                                {user[col.column_name]} 
                              </td>))}
                          </tr>))}
                      </tbody>
                      </table>
                  </div>
                </div>

                 {/* DETAILS */}
                <div className='container_header container'>
                  <p className='invoice_txt_header'> <br></br>Adjustments: </p>
                  <div className='invoice_bar'></div>
                  
                  <div className='invoice_table_container d-flex justify-content-center'>
                  <table id='details_table' contentEditable={true}>
                  <tbody>
                        {state.isLoading && skeleton_adjustments.map((user,i) => (
                          <tr key={i}> 
                              <td><><b className='invoice_skeleton_p_text'>{user.label}</b></></td>
                              <td>
                                <div className='d-flex flex-row justify-content-center align-items-center container_developer_rate'>
                                <><b className='invoice_skeleton_p_text'>{user.man_hours}</b></> &nbsp;
                                  man-hours
                                </div>
                              </td>
                              <td> <><b className='invoice_skeleton_p_text'>{user.description}</b></></td>
                          </tr>))}
                        {!state.isLoading  && adjustmentsList.map((user,i) => (
                          <tr key={i}> 
                              <td>{user.label}</td>
                              <td>{user.man_hours} man-hours</td>
                              <td>{user.description}</td>
                          </tr>))}
                      </tbody>
                  </table>
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
