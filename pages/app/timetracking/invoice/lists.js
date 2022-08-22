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
    
            const invoicesRaw = await slsFetch(`/api/app/timetracking/invoice/get_invoices`);
            const invoices = await invoicesRaw.json();
    
            setInvoiceList(invoices)
    
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
        { id: "invoice_number", displayName: "INVOICE NO.", accessor: "invoice_number" },
        { id: "rate", displayName: "Rate", accessor: "rate" },
        { id: "total_amount", displayName: "Total Amount", accessor: "total_amount" },
        { id: "due_at", displayName: "Due Date", accessor: "due_at" },
      ];
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout> 
        <>
      <div className='table_container' style={{visibility: 'visible'}}>
        <table className='table table-striped'>
          <thead>
            <tr>
            {columns.map((col) => (
              <th key={col.invoice_number}> {col.displayName} </th>
            ))}
            </tr>
          </thead>
          
          <tbody>
          { !state.isLoading && 
                invoiceList.map((list, i) => (
                    <>
                      <tr key={i}>
                        {columns.map((col) => (
                          <td key={col.invoice_number}>
                            <Link href={`/app/timetracking/invoice/${list.invoice_number}`}>  
                              <td key={list.invoice_number}> 
                                {list[col.accessor]}
                              </td>
                            </Link>
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
