import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";

/** kladusol CMS components */
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'

/** react-icons */
import { FaCheck, FaImage} from "react-icons/fa";
import { MdModeEditOutline } from 'react-icons/md';
import { VscListSelection } from 'react-icons/vsc';

export default function CreateNewEntry({cache}) {
  /** Data Arrays : to be fetched from database soon */
  const items = [
    {name: 'Id'}, 
    {name: 'Name'},
    {name: 'Price'},
    {name: 'Image1'}
  ];

  const entryNumber = [
    {name: '10'}, 
    {name: '20'},
    {name: '50'},
    {name: '100'},
  ]

  const columns = [
    { accessor: "checkbox", displayName: <input type="checkbox" />, },
    { accessor: "id", displayName: "ID",  },
    { accessor: "name", displayName: "NAME", },
    { accessor: "price", displayName: "PRICE", },
    { accessor: "image_1", displayName: "IMAGE1",  },
    { accessor: "", displayName: "", },
  ];

  const entries = [
      {checkbox: <input type="checkbox" />, id: 1, name: 'Porschetta', price: 4000, image_1: null },
      {checkbox: <input type="checkbox" />, id: 2, name: 'Brownies', price: 500, image_1: null }
  ]

  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout title="Content">
        <AppBackButton link='/admin/content-manager/articles' />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
          <div>
          <h3> Create an Entry </h3>
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
               <input type="text" className="input_text" /> 
               <p className="mt-2"> Image </p>
               <button className="btn_add_image">  <FaImage className="icon_add_image" />
               <p style={{fontSize: '11px'}}> Click to add an asset </p> </button>
              </div>
              <div className="col">
               <p className="mt-2"> Price </p>
               <input type="number" className="input_text" /> 
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
                <p style={{fontSize: '12px'}}>  now  </p>
              </div>

              <div className="d-flex align-items-center justify-content-between">
              <p style={{fontSize: '12px'}}> <b> By </b> </p>
              <p style={{fontSize: '12px'}}>   </p>
              </div>

               
              <div className="d-flex align-items-center justify-content-between">
              <p style={{fontSize: '12px'}}> <b> Last update  </b> </p>
              <p style={{fontSize: '12px'}}>  now  </p>
              </div>

              <div className="d-flex align-items-center justify-content-between">
              <p style={{fontSize: '12px'}}> <b> By </b> </p>
              <p style={{fontSize: '12px'}}>    </p>
              </div>

            </div>
            <button className="new_entry_block_button mt-2">  <MdModeEditOutline  className='icon_block_button' /> Edit the model </button>
            <button className="new_entry_block_button mt-2">  <VscListSelection  className='icon_block_button' /> Configure the view </button>
          </div>
          
        </div>

       
     
         
      </InnerLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
