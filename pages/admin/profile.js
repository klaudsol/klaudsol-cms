import BasicLayout from "@/components/layouts/BasicLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'

import { FaCheck } from "react-icons/fa";

export default function Profile({cache}) {

  const { firstName = null, lastName = null, defaultEntityType = null } = cache ?? {};
  return (
    <CacheContext.Provider value={cache}>
      <BasicLayout>
        <div className="d-flex align-items-center justify-content-between my-5 mx-4">
          <h3> {firstName} {lastName} </h3>
          <AppButtonLg title='Save' icon={<FaCheck />} isDisabled/>
        </div>

        <div className="row px-4">
          <div className="container_new_entry py-4 px-4">
            <div className="row">
            <h5> <b> Profile </b></h5>
            <div className="col">
             
               <p className="mt-1 mb-1"> First name </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
               <p className="mt-1 mb-1"> Email </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
               
              </div>
              <div className="col">
               <p className="mt-1 mb-1"> Last name </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
               <p className="mt-1 mb-1"> Username </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
              
              </div>
            </div>
          </div>
        </div>

        <div className="row px-4 my-5">
          <div className="container_new_entry py-4 px-4">
            <div className="row">
            <h5> <b> Change password </b></h5>
            <div className="col">
               <p className="mt-1 mb-1"> Current Password </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
               <p className="mt-1 mb-1"> New password </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
              </div>
              <div className="col d-flex align-items-end">
                <div className='col d-flex flex-column'>
                <p className="mt-1 mb-1"> Confirm Password </p>
               <input type="text" className="input_text mb-3" value={'name test'} /> 
                </div>
              
              
              </div>
            </div>
          </div>
        </div>
        
      </BasicLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
