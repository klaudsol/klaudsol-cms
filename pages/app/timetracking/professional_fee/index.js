import { useEffect, useState, useCallback, useReducer } from 'react';
import { getSessionCache } from '@/lib/Session';
import CacheContext from '@/components/contexts/CacheContext';
import InnerLayout from '@/components/layouts/InnerLayout';
import DropDown from '@/components/timetracking/DropDown';
import { slsFetch } from '@/components/Util'; 
import TimetrackingDate from '@/components/timetracking/TimetrackingDate';
import Image from 'next/image';
import { GiRotaryPhone, GiArrowCursor } from 'react-icons/gi';
import { FaPlus, FaDownload, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import { BsFillNutFill } from 'react-icons/bs';
import SMEFormSelect from '@/lib/sme/SMEFormSelect';

export default function ProfessionalFee({cache}) {
    //TODO: Refactor this to reducer state
    
    
    const initialState = {
      form: {},
      invoices: [],
      customers: [],
      people: [],
      fee: {
        grossPay: 0,
        netPay: 0,
        totalHours: 0,
        rate: 0, 
        withholdingTax: 0,
        payment_to: null, 
        code: null,
        payment_number:  null
      },
      invoiceEntries: [],
    };
    
    const SET_FORM_VALUES = 'SET_FORM_VALUES';
    const SET_INVOICES = 'SET_INVOICES';
    const SET_CUSTOMERS = 'SET_CUSTOMERS';
    const SET_PEOPLE = 'SET_PEOPLE';
    const SET_FEE = 'SET_FEE';
    const SET_INVOICE_ENTRIES = 'SET_INVOICE_ENTRIES';
    const SET_TOTAL_HOURS = 'SET_TOTAL_HOURS';
    const SET_FEE_VALUES = 'SET_FEE_VALUES';
    
    
    const reducer = (state, action) => {
      
      switch(action.type) {
        case SET_FORM_VALUES:  
          return {
            ...state,
            form: {
              ...state?.form,
              [action.payload.name]: action.payload.value
            }
          }
        
        case SET_INVOICES:
          return {
            ...state,
            invoices: action.payload
          }
          
        case SET_CUSTOMERS:
          return {
            ...state,
            customers: action.payload
          }
          
        case SET_PEOPLE:
          return {
            ...state,
            people: action.payload
          }
          
        case SET_FEE:
          return {
            ...state,
            fee: {
              ...state.fee,
              ...action.payload
            }
          }
          
        case SET_FEE_VALUES:  
          return {
            ...state,
            fee: {
              ...state?.fee,
              [action.payload.name]: action.payload.value
            }
          }
          
        case SET_INVOICE_ENTRIES:
          return {
            ...state,
            invoiceEntries: action.payload
          }
          
          
      }
    };
    
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const columns = [
        { id: "start_time", displayName: "Start Time", accessor: "start_time" },
        { id: "end_time", displayName: "End Time", accessor: "end_time" },
        { id: "duration", displayName: "Duration", accessor: "duration" },
        { id: "description", displayName: "Description", accessor: "description" },
    ];
    
    
    const defaultOptionFor = (label) => [{label, value: null}];
    const defaultOptionForClient = defaultOptionFor("(Select Client)");
    const defaultOptionForTeamMembers = defaultOptionFor("(Select Developer)");
    const DECIMAL_PRECISSION = 4;
    const RATE_PRECISSION = 2;
    const COMMA_REPLACE = /\B(?=(\d{3})+(?!\d))/g;
    
    //refactor as static instead
    const timetracking_date = new TimetrackingDate();
    
    const [clientOptions, setClientOptions] = useState(defaultOptionForClient);
    const [teamMemberOptions, setTeamMemberOptions] = useState(defaultOptionForTeamMembers);
    const [timesheetData, setTimesheetData] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [peopleId, setPeopleId] = useState(null);
    const [invoiceId, setInvoiceId] = useState(null);
    //const [totalHours, setTotalHours] = useState(0);
    const [averageHours, setAverageHours] = useState(0);

    // professional fee 
    const [paymentNumber, setPaymentNumber] = useState('---');
    const [paymentTo, setPaymentTo] = useState('---');
    const [developerRate, setDeveloperRate] = useState('---');
    
    const totalHours = (entries) => entries.map(entry => +(entry.duration ?? 0)).reduce((sum, duration) => sum + duration, 0) ?? 0
    

    /*** Customers list ***/
    useEffect(() => { 
      (async () => {
        
        const customersRaw = await slsFetch('/api/app/timetracking/customers');  
        const customers = await customersRaw.json();
        dispatch({type: SET_CUSTOMERS, payload: customers});
        
      })();
    }, []);

    /*** Developers list ***/
    useEffect(() => { 
      (async () => {
        
        const teamMembersRaw = await slsFetch('/api/app/timetracking/professionals');  
        let teamMembers = await teamMembersRaw.json();
        teamMembers = teamMembers.map(teamMember => ({
          ...teamMember,
          display_name: `${teamMember.first_name} ${teamMember.last_name}`
        }));
        dispatch({type: SET_PEOPLE, payload: teamMembers});
        
      })();
    }, []);
    
    /*** Invoices list ***/
    useEffect(() => {
      (async () => {
        const invoicesRaw = await slsFetch('/api/app/timetracking/invoices');  
        const invoices = await invoicesRaw.json();
        dispatch({type: SET_INVOICES, payload: invoices});
      })();
    }, []); 
    
    
    /*** Fee ***/
    useEffect(() => {
      
      if(!state.form.sme_people_id) return;
      
      //Caveat: the form is stored as a string
      const professional = state.people.find((person) => person.id === parseInt(state.form.sme_people_id, 10));
      const { rate, payment_to, code } = professional
      dispatch({type: SET_FEE, payload: { 
        rate: Number(rate), 
        payment_to, 
        code,
        payment_number: `${code}${dateTimestamp()}`
      }});
      
    }, [state.form.sme_people_id]);

    /*** Timesheet ***/
    /*
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

        const peopleProfessionalRaw = await slsFetch('/api/app/timetracking/reports/get_people_professional');  
        const peopleProfessional = await peopleProfessionalRaw.json();

        const tenantSettingsRaw = await slsFetch('/api/core/tenant_settings');  
        const tenantSettings = await tenantSettingsRaw.json();

        const professionalFeesRaw = await slsFetch('/api/app/timetracking/professional_fee/get_professional_fees');  
        const professionalFees = await professionalFeesRaw.json();
      
        const selectedPeopleProfessional = peopleProfessional.filter(people => people.sme_people_id === peopleId)[0];

        if(peopleId) {
          setTimesheetData(reports.map(report => {
            return {
              ...report,
              developer: `${report.first_name} ${report.last_name}`,
              start_time: timetracking_date.convertUTC(report.start_time),
              end_time: timetracking_date.convertUTC(report.end_time)
            }
          }));

          const _totalHours = reports.map(report => +(report.duration ?? 0)).reduce((sum, duration) => sum + duration, 0) ?? 0;
          const startTimeDates = reports.map((report) => new Date(report.start_time).toLocaleDateString());
          const uniqueStartTimeDates = [...new Set(startTimeDates)];

          const _developerRate = selectedPeopleProfessional.rate;
          const _grossPay = _developerRate * _totalHours;
          const _tax = _grossPay * tenantSettings[0].tax;
          const _netPay = _grossPay - _tax;

          onPaymentNumberChange(selectedPeopleProfessional.code, professionalFees)
          setPaymentTo(selectedPeopleProfessional.payment_to)
          setTotalHours(_totalHours.toFixed(DECIMAL_PRECISSION));
          setAverageHours((_totalHours / uniqueStartTimeDates.length).toFixed(DECIMAL_PRECISSION));
          
          setDeveloperRate(parseFloat(_developerRate).toFixed(RATE_PRECISSION));
  
          setGrossPay(parseFloat(_grossPay).toFixed(RATE_PRECISSION)); 
          setTax(parseFloat(_tax).toFixed(RATE_PRECISSION));
          setNetPay(parseFloat(_netPay).toFixed(RATE_PRECISSION));
        }
      })();
    }, [clientId, peopleId, invoiceId]);
    */


    useEffect(() => {
      
      (async() => {
        
        if(!state.form.invoice_number || !state.form.sme_people_id) return; 
        
        const params = {
          sme_people_id: state.form.sme_people_id,
          invoice_number: state.form.invoice_number
        }
        
        const fetchDataParams = Object.fromEntries(Object.entries(params).filter(([key, value]) => value));
        
        const responseRaw = await slsFetch(`/api/app/timetracking/invoice_entries?${new URLSearchParams(fetchDataParams)}`);
        const response = await responseRaw.json();
        
        console.error(response);
        
         dispatch({type: SET_INVOICE_ENTRIES, payload: response.map(report => ( 
          {
            ...report,
            developer: `${report.first_name} ${report.last_name}`,
            start_time: timetracking_date.convertUTC(report.start_time),
            end_time: timetracking_date.convertUTC(report.end_time)
          }
        ))});       
        
        dispatch({type: SET_FEE, payload: {totalHours: totalHours(response) }});
        
      })(); 
        
    }, [state.form.invoice_number, state.form.sme_people_id]);
    
    
    //TODO: Recalculate gross pay
    useEffect(() => {
      dispatch({type: SET_FEE, payload: {
        grossPay: state.fee.totalHours * state.fee.rate,
        withholdingTax: (state.fee.totalHours * state.fee.rate) * 0.10,
        netPay: (state.fee.totalHours * state.fee.rate) * 0.90,
      }});  
    }, [state.fee.totalHours, state.fee.rate]);

    /* save professional fee to database */ 

      const onSaveProfessionalFee = useCallback(() => {
        (async () => {
            try {
              const response = await slsFetch('/api/app/timetracking/professional_fee/create_professional_fee', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json'
                },
                //body: JSON.stringify({peopleId, paymentNumber, totalHours, developerRate, grossPay, tax, netPay, averageHours})
              })
              if (response.status === 200) alert("Professional fee saved successfully.")
            } catch(ex) {
              console.error(ex.stack);  
            } finally {
              setPaymentNumber("---");
            }
        })();
      }, [peopleId, paymentNumber, totalHours, developerRate, /*grossPay, tax, netPay,*/ averageHours]);

    /*** save professional fee entries to database */
    const onSaveProfessionalFeeEntries = useCallback(() => {
      (async () => {
          try {
            const response = await slsFetch('/api/app/timetracking/professional_fee/create_professional_fee_entries', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({peopleId, clientId, paymentNumber})
            })
          } catch(ex) {
            console.error(ex.stack);  
          } finally {
            setPaymentNumber("---");
          }
      })();
    }, [peopleId, clientId, paymentNumber]);

    function onSave(){
      onSaveProfessionalFee();
      onSaveProfessionalFeeEntries();
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

    // function that generates a random invoice number
    function paymentNumberGenerator(code, counter){
      let dateNow = new Date();
      return code + counter + dateNow.getFullYear () + ("0" + (dateNow.getMonth()+1)).slice(-2) + ("0" + (dateNow.getDate())).slice(-2);
    }
    
    const dateTimestamp = () => {
      let dateNow = new Date();
      return dateNow.getFullYear () + ("0" + (dateNow.getMonth()+1)).slice(-2) + ("0" + (dateNow.getDate())).slice(-2);
    }

    const onPaymentNumberChange = (code, professionalFees) => {
      try {
        const previousProfessionalFees = professionalFees.find(professionalFee => professionalFee.payment_number.substring(0,3) === code)
        const nextPaymentNumber = Number(previousProfessionalFees.payment_number.substring(3,6)) + 1;
        setPaymentNumber(paymentNumberGenerator(code, nextPaymentNumber.toString().padStart(3,'0')));
        setChange(!change);
      } catch(e) {
        setPaymentNumber(paymentNumberGenerator(code, '001'));
        setChange(!change);
      }
  
    }
    
    const onFormInputChange = (e) => {
      const { name, value } = e.target;
      dispatch({type: SET_FORM_VALUES, payload: {name , value}});
    };
    
    const currency = (value) => new Intl.NumberFormat('en-PH', { currency: 'PHP',style: 'currency'}).format(value);
    
    
    return (
    <CacheContext.Provider value={cache}>
     <>
        <InnerLayout> 
          <>
            <div className='container-fluid'> {/* time tracking main container START*/}
              <div className='row gx-4'> {/* row #1 START*/}
                  <div className="col-xl-12 col-lg-12 col-md-12"> 
                  { !state.isRefresh && (
                      <>
                      <div>
                        <div className='row gx-4'>
                          <div className='col-md-12'>
                              <div className='d-flex'>
                                
                                <div className='col-md-2 mx-1'>
                                  <SMEFormSelect 
                                    name='client_id' 
                                    placeholder='(Select Client)'
                                    onChange={onFormInputChange}
                                  >
                                    {state.customers.map(client => (
                                      <option key={client.id} value={client.id}>{client.display_name}</option>
                                    ))}
                                  </SMEFormSelect>
                                </div>
                                
                                
                                <div className='col-md-2 mx-1'>
                                  <SMEFormSelect 
                                    name='sme_people_id' 
                                    placeholder='(Select Developer)'
                                    onChange={onFormInputChange}
                                  >
                                    {state.people.map(developer => (
                                      <option key={developer.id} value={developer.id}>{developer.display_name}</option>
                                    ))}
                                </SMEFormSelect>
                                </div>
                                
                                <div className='col-md-2 mx-1'>
                                  <SMEFormSelect 
                                    name='invoice_number'
                                    placeholder='(Select Invoice)'
                                    onChange={onFormInputChange}
                                  >
                                    {state.invoices.sort((b, a) => b.invoice_number < a.invoice_number ? -1 : 1 ).map(invoice => (
                                      <option key={invoice.invoice_number}>{invoice.invoice_number}</option>
                                    ))}
                                  </SMEFormSelect>
                                </div>

                                <div className='col-md-4 mx-1'>
                                  <button   className='btn btn-success btn_select_all'  onClick={selectText} disabled={state.isLoading || clientId === null || peopleId === null}> <GiArrowCursor/></button>
                                  
                                  <button   className='btn btn-success btn_select_all'  onClick={onSave} disabled={state.isLoading || clientId === null || peopleId === null}> <FaSave/></button>
  
                                  <Link href='/app/timetracking/professional_fee/lists'> 
                                    <button className='btn btn-success btn_select_all' disabled={state.isLoading}> List of Professional Fees </button>
                                  </Link>
                                
                                   {state.isLoading && (
                                  <span className="spinner_loading">
                                    <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
                                  </span>
                                  )} 
                                </div>    
                              </div>
                            </div> 
                      </div>
                    </div> {/* end of timesheet container*/}
                    </>
                    )}
                  </div> 
              </div> {/* row #1 END */}

              <div className='row gx-4'> {/* row #2 START */}
                <div className='col-xl-12 col-lg-12 col-md-12'>
                <div className='container_fluid d-flex align-items-center justifiy-content-center row'>

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
                                     {!state.isLoading && ( 
                                        <>
                                          {state.fee.payment_number} <br></br>
                                        </>
                                     )} 
                                      

                    Payment To: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Payment to here </b></>)}
                              {!state.isLoading  && state.fee.payment_to }<br></br>

                    <div className='d-flex flex-row m-0 p-0'>
                    Total: {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Total Hours here</b></>)}
                          {!state.isRefresh && state.fee.totalHours.toFixed(4)} hours
                    </div>

                    <div className='d-flex flex-row m-0 p-0'>
                    Rate: 
                          {state.isRefresh && ( <><b className='invoice_skeleton_p_text'>Developer Rate here</b></>)}
                          {!state.isRefresh && currency(state.fee.rate) }
                    </div>

                    Gross Pay: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Gross Pay</b></>)}
                              {!state.isLoading  && currency(state.fee.grossPay) }<br></br>

                    Witholding Tax &#40;10%&#41;: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Witholding tax here</b></>)}
                              {!state.isLoading  && currency(state.fee.withholdingTax) }<br></br><br></br>

                    Net Pay &#40;Gross Pay less Tax&#41;: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Net Pay here</b></>)}
                              {!state.isLoading  && currency(state.fee.netPay) }<br></br> <br></br>

                    {/*
                    Average/Day: {state.isLoading  && ( <><b className='invoice_skeleton_p_text'>Average per day here</b></>)}
                              {!state.isLoading  && averageHours } hours<br></br><br></br>
                    */}

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
                      <th key={col.accessor} className="text-center">{col.displayName}</th>
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
                          {!state.isLoading  && state.invoiceEntries.map((invoiceEntry, i) => (
                          <tr key={i}> 
                              {columns.map((col,i) =>   (
                              <td key={i}> 
                                {invoiceEntry[col.accessor]} 
                              </td>))}
                          </tr>))}
                      </tbody>
                      </table>
                  </div>
                </div> 

            </div>
        </div>
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