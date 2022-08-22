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
    const { payment_number } = router.query;

    const [professionalFeeList, setProfessionalFeeList] = useState([]);
    const [professionalFeeEntriesList, setProfessionalFeeEntriesList] = useState([]);
    const [paymentTo, setPaymentTo] = useState([]);

    const timetracking_date = new TimetrackingDate();


    const DECIMAL_PRECISSION = 4;
    const RATE_PRECISSION = 2;
    const COMMA_REPLACE = /\B(?=(\d{3})+(?!\d))/g;


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

                const professionalFeesRaw = await slsFetch(`/api/app/timetracking/professional_fee/get_professional_fees`);
                const professionalFees = await professionalFeesRaw.json();

                setProfessionalFeeList(professionalFees.filter(professionalFee => professionalFee.payment_number === payment_number).map(professionalFee => {
                  return{
                      ...professionalFee, 
                      gross_pay: parseFloat(professionalFee.gross_pay).toFixed(RATE_PRECISSION).toString().replace(COMMA_REPLACE, ","),
                      withholding_tax: parseFloat(professionalFee.withholding_tax).toFixed(RATE_PRECISSION).toString().replace(COMMA_REPLACE, ","),
                      net_pay: parseFloat(professionalFee.net_pay).toFixed(RATE_PRECISSION).toString().replace(COMMA_REPLACE, ","),
                  }
              })[0]);

              const fetchDataParams = Object.fromEntries(
                Object.
                  entries({payment_number: payment_number ?? null}).
                  filter(([key, value]) => value)
              );

                const professionalFeeEntriesRaw = await slsFetch(`/api/app/timetracking/professional_fee/get_professional_fee_entries?${new URLSearchParams(fetchDataParams)}`);
                const professionalFeeEntries = await professionalFeeEntriesRaw.json();

                setProfessionalFeeEntriesList(professionalFeeEntries.map(entry => {
                  return {
                    ...entry,
                    developer: `${entry.first_name} ${entry.last_name}`,
                    start_time: timetracking_date.convertUTC(entry.start_time),
                    end_time: timetracking_date.convertUTC(entry.end_time)
                  }
                }))

                setPaymentTo(professionalFeeEntries[0].payment_to)

                

              } catch (ex) {
                alert(ex.stack)
              } finally {
                dispatch({type: 'CLEANUP'});
              }

        })();
      }, [payment_number]); 

  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout> 
        <>
        <div className='container_fluid d-flex align-items-center justifiy-content-center row'>
          <div className='container text-center container_invoice_buttons'>
            <Link href='/app/timetracking/professional_fee/lists'> 
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

                {/* Professional Fee Header */}
                <div className='container'>
                    <p className='invoice_txt_general'> 
                                    <br></br> <br></br>
                    Payment Number:  {state.isLoading && ( <><b className='invoice_skeleton_p_text'>Payment number here</b></>)}
                                     {!state.isLoading && professionalFeeList.payment_number } <br></br>

                    Payment To: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Payment to here </b></>)}
                              {!state.isLoading  && paymentTo }<br></br>

                    <div className='d-flex flex-row m-0 p-0'>
                    Total: {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Total Hours here</b></>)}
                          {!state.isRefresh && professionalFeeList.total_hours} hours
                    </div>

                    <div className='d-flex flex-row m-0 p-0'>
                    Rate: &#8369;{state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Developer Rate here</b></>)}
                          {!state.isRefresh && professionalFeeList.rate }
                    </div>

                    Gross Pay: &#8369;{state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Gross Pay here</b></>)}
                              {!state.isLoading  && professionalFeeList.gross_pay }<br></br>

                    Witholding Tax &#40;10%&#41;: &#8369;{state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Witholding tax here</b></>)}
                              {!state.isLoading  && professionalFeeList.withholding_tax }<br></br><br></br>

                    Net Pay &#40;Gross Pay less Tax&#41;: &#8369;{state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Net Pay here</b></>)}
                              {!state.isLoading  && professionalFeeList.net_pay }<br></br> <br></br>

                    Average/Day: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Average per day here</b></>)}
                              {!state.isLoading  && professionalFeeList.average_hours } hours<br></br><br></br>

                    </p>
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
                          {/*state.isLoading  && skeleton_timesheet.map((user, i) => (
                          <tr key={i}> 
                              {columns.map((col,i) =>   (
                              <td key={i}> 
                                <><b className='invoice_skeleton_p_text'>{user[col.accessor]}</b></>
                              </td>))}
                              </tr>))*/}
                          {!state.isLoading  && professionalFeeEntriesList.map((user, i) => (
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

                
            </div>
        </div>
        </>   
      </InnerLayout>
    </CacheContext.Provider>
  );

}

export const getServerSideProps = getSessionCache();