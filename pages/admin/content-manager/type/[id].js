import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

/** kladusol CMS components */
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'

/** react-icons */
import { FaCheck, FaImage, FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from 'react-icons/md';
import { VscListSelection } from 'react-icons/vsc';


export default function Type({cache}) {
  const router = useRouter();

  const { id } = router.query;
  
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  /** Data Arrays : to be fetched from database soon */

  useEffect(() => {
    const entries = [
        {checkbox: <input type="checkbox" />, id: 1, name: 'Porschetta', price: 4000, image_1: null },
        {checkbox: <input type="checkbox" />, id: 2, name: 'Brownies', price: 500, image_1: null }
    ]
    const selectedEntry = entries.filter(entry => entry.id === parseInt(id));
    setName(selectedEntry[0].name);
    setPrice(selectedEntry[0].price);
  }, [id]);

  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout title="Content">
        <AppBackButton link='/admin/content-manager' />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
          <div>
          <h3> {name} </h3>
          <p> API ID : type </p>
          </div>
          <AppButtonLg title='Save' icon={<FaCheck />} isDisabled/>
        </div>

        <div className="row mt-4">
          <div className="col-9">
            <div className="container_new_entry py-4 px-4"> 
            <div className="row">
              <div className="col">
               <p className="mt-2"> Name </p>
               <input type="text" className="input_text" value={name} /> 
               <p className="mt-2"> Image </p>
               <button className="btn_add_image">  <FaImage className="icon_add_image" />
               <p style={{fontSize: '11px'}}> Click to add an asset </p> </button>
              </div>
              <div className="col">
               <p className="mt-2"> Price </p>
               <input type="number" className="input_text" value={price} /> 
               <p className="mt-2"> Image </p>
               <button className="btn_add_image"> 
               <FaImage className="icon_add_image" />
               <p style={{fontSize: '11px'}}> Click to add an asset </p>
               </button>
              </div>
            </div>
               
            </div>
          </div>
          <div className="col-3 mx-0">
            <div className="container_new_entry px-3 py-4"> 
               <p style={{fontSize: '11px'}}> INFORMATION </p>
               <div className="block_bar"></div>
             
              <div className="d-flex align-items-center justify-content-between">
                <p style={{fontSize: '12px'}}> <b> Created </b> </p>
                <p style={{fontSize: '12px'}}>  2 days ago  </p>
              </div>

              <div className="d-flex align-items-center justify-content-between">
              <p style={{fontSize: '12px'}}> <b> By </b> </p>
              <p style={{fontSize: '12px'}}> Ardee Aram </p>
              </div>

               
              <div className="d-flex align-items-center justify-content-between">
              <p style={{fontSize: '12px'}}> <b> 2 days ago  </b> </p>
              <p style={{fontSize: '12px'}}>  Ardee Aram  </p>
              </div>

              <div className="d-flex align-items-center justify-content-between">
              <p style={{fontSize: '12px'}}> <b> By </b> </p>
              <p style={{fontSize: '12px'}}>    </p>
              </div>

            </div>
            <button className="new_entry_block_button mt-2">  <MdModeEditOutline  className='icon_block_button' /> Edit the model </button>
            <button className="new_entry_block_button mt-2">  <VscListSelection  className='icon_block_button' /> Configure the view </button>
            <button className="new_entry_block_button_delete mt-2">  <FaTrash  className='icon_block_button' /> Delete the entry </button>
          </div>
          
        </div>

       
     
         
      </InnerLayout>
      </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
