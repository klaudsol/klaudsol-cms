import InnerLayout from '@/components/layouts/InnerLayout';
import { getSessionCache } from '@/lib/Session';
import CacheContext from '@/components/contexts/CacheContext';
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { slsFetch } from '@/components/Util'; 
import Link from 'next/link';

export default function Invoice({cache}) {
    const [invoiceList, setInvoiceList] = useState([]);

    const initialState = {
        isLoading: false,
        isRefresh: true,
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
              isRefresh: false,
            }
          default:
            return state;
        }
      }

    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchData = useCallback(() => {
        (async () => {
          try {
            dispatch({type: 'LOADING'});

            const professionalFeesRaw = await slsFetch(`/api/app/timetracking/professional_fee/get_professional_fees`);
            const professionalFees = await professionalFeesRaw.json();

            setInvoiceList(professionalFees)

          } catch (ex) {
            alert(ex.stack)
          } finally {
            dispatch({type: 'CLEANUP'});
          }
        })();
      }, []);

      useEffect(() => {
        fetchData();
      }, [fetchData]);

      const columns = [
        { id: "payment_number", displayName: "PAYMENT NO.", accessor: "payment_number" },
        { id: "total_hours", displayName: "TOTAL HOURS", accessor: "total_hours" },
        { id: "rate", displayName: "RATE", accessor: "rate" },
        { id: "average_hours", displayName: "AVERAGE HOURS", accessor: "average_hours" },
      ];

      const currency = (value) => new Intl.NumberFormat('en-PH', { currency: 'PHP',style: 'currency'}).format(value);
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout> 
        <>
        <div className='table_container' style={{visibility: 'visible'}}>
          <table className='table table-striped'>
            <thead>
              <tr>
                {columns.map((x) => (
                  <th key={x.payment_number}>{x.displayName}</th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              { !state.isLoading && 
                    invoiceList.map((list, i) => (
                        <>
                        <tr key={i}>
                            {columns.map((col) => (
                              <td key={col.payment_number}>
                                  <td key={list.payment_number}>
                                    {col.id === "payment_number" && (
                                      <Link href={`/app/timetracking/professional_fee/${list.payment_number}`}>
                                        <u className='professionalFeePaymentNum'> {list[col.accessor]}</u>
                                      </Link>
                                    )}
                                    {col.id === "total_hours" && list[col.accessor]}
                                    {col.id === "rate" && currency(list[col.accessor])}
                                    {col.id === "average_hours" && list[col.accessor]}
                                  </td>
                              </td>
                            ))}
                        </tr>
                        </>
                    ))
                }
            </tbody>
          </table>
        </div>
        </>   
      </InnerLayout>
    </CacheContext.Provider>
  );

}

export const getServerSideProps = getSessionCache();