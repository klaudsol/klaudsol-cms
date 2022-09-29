import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from '@/components/elements/inner/ContentManagerSubMenu';
import { getSessionCache } from "@/lib/Session";

import { useRouter } from 'next/router'
import { useEffect, useReducer } from 'react';
import { slsFetch } from '@/components/Util'; 

/** kladusol CMS components */
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'

/** react-icons */
import { FaCheck, FaImage} from "react-icons/fa";
import { MdModeEditOutline } from 'react-icons/md';
import { VscListSelection } from 'react-icons/vsc';

export default function CreateNewEntry({cache}) {

  const router = useRouter();

  const { entity_type_slug } = router.query;

  const initialState = {
    attributes: [],
    form: [], 
    isLoading: false,
    isRefresh: true,
  };

  const LOADING = 'LOADING';
  const REFRESH = 'REFRESH';
  const CLEANUP = 'CLEANUP';

  const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
  const SET_ENTITY_TYPE_NAME = 'SET_ENTITY_TYPE_NAME';
  const SET_FORM_VALUES = 'SET_FORM_VALUES';

  const reducer = (state, action) => {
    switch(action.type) {
      case LOADING:
          return {
            ...state,
            isLoading: true,
          }

       case REFRESH:
            return {
              ...state,
              isRefresh: false,
            }

       case CLEANUP:
            return {
              ...state,
              isLoading: false,
            }
            
      case SET_ATTRIBUTES:
        return {
          ...state,
          attributes: action.payload
        }

      case SET_ENTITY_TYPE_NAME:
        return {
          ...state,
          entity_type_name: action.payload
        }

        case SET_FORM_VALUES:
          return {
            ...state,
            form: {
              ...state.form,
              ...action.payload
            }
          }

    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);



  useEffect(() => { 
    (async () => {
      const attributesRaw = await slsFetch(`/api/klaudsolcms/attributes/${entity_type_slug}`);  
      const attributes = await attributesRaw.json();

           
      dispatch({type: SET_ATTRIBUTES, payload: attributes.map(attribute => {
        return {
          name: attribute.attributes_name, 
          type: attribute.attributes_type,
        }
      })});

      dispatch({type: SET_FORM_VALUES, payload: attributes.map(attribute => {
        return {
          name: attribute.attributes_name, 
          type: attribute.attributes_type,
          value: null,
        }
      })});

    })();
  }, [entity_type_slug]);



  return (
    <CacheContext.Provider value={cache}>
       <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
      <ContentManagerSubMenu title='Content'/>
      <InnerLayout title="Content">
      <div className="py-4">
        <AppBackButton link='/admin/content-manager/articles' />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
          <div>
          <h3> Create an Entry </h3>
          <p> API ID : {entity_type_slug} </p>
          </div>
          <AppButtonLg title='Save' icon={<FaCheck />} isDisabled={!state.form} onClick={() => alert(JSON.stringify(state.attributes))}/>
        </div>

        <div className="row mt-4">
          <div className="col-9">
          <div className="container_new_entry py-4 px-4"> 
            {state.attributes.map(attribute => (
              <>
                <p className="mt-1"> <b>{attribute.name.toUpperCase()}</b> </p>
                {attribute.type === 'text' && <input type="text" name={attribute.type} className="input_text mb-2" onChange={e => {
                  attribute.value = e.target.value;
                }} />}
                {attribute.type === 'textarea' && <textarea name={attribute.type}  className='input_textarea'  onChange={e => {
                  attribute.value = e.target.value;
                }}/>}
                {attribute.type === 'float' && <input type="number" name={attribute.type}  className="input_text mb-2" onChange={e => {
                  attribute.value = e.target.value;
                }}/>}
              </>
            ))
            }
            </div>
          </div>
          <div className="col-3 mx-0">
            <div className="container_new_entry px-3 py-4"> 
               <p style={{fontSize: '11px'}}> INFORMATION </p>
               <div className="block_bar"></div>
             
              <div className="d-flex align-items-center justify-content-between my-2">
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

       
     
         </div>
      </InnerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
