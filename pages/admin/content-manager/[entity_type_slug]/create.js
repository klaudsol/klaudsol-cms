import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from '@/components/elements/inner/ContentManagerSubMenu';
import { getSessionCache } from "@/lib/Session";

import { useRouter } from 'next/router'
import { useEffect, useReducer, useCallback } from 'react';
import { slsFetch } from '@/components/Util'; 

/** kladusol CMS components */
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton';
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg';
import AppButtonSpinner from '@/components/klaudsolcms/AppButtonSpinner';
import AppInfoModal from '@/components/klaudsolcms/modals/AppInfoModal';

/** react-icons */
import { FaCheck, FaImage} from "react-icons/fa";
import { MdModeEditOutline } from 'react-icons/md';
import { VscListSelection } from 'react-icons/vsc';

import { DEFAULT_SKELETON_ROW_COUNT } from "lib/Constants";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";

export default function CreateNewEntry({cache}) {

  const router = useRouter();

  const { entity_type_slug } = router.query;

  const initialState = {
    form: {},
    attributes: [],
    columns: [],
    entries: [],
    temp: [],
    form: [], 
    slug: null,
    isLoading: false,
    isRefresh: true,
    isSaving: false,
    show: false,
    entity_type_id: null,
  };

  const LOADING = 'LOADING';
  const REFRESH = 'REFRESH';
  const CLEANUP = 'CLEANUP';
  const SAVING = 'SAVING';

  const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
  const SET_COLUMNS = 'SET_COLUMNS';
  const SET_ENTRIES = 'SET_ENTRIES';
  const SET_ENTITY_TYPE_NAME = 'SET_ENTITY_TYPE_NAME';
  const SET_FORM_VALUES = 'SET_FORM_VALUES';
  const SET_SHOW = 'SET_SHOW';
  const SET_SLUG = 'SET_SLUG';
  const SET_TEMP = 'SET_TEMP';

  const SET_ENTITY_TYPE_ID = 'SET_ENTITY_TYPE_ID';

  const reducer = (state, action) => {
    switch(action.type) {
      case LOADING:
          return {
            ...state,
            isLoading: true,
          }

        case SAVING:
          return {
            ...state,
            isSaving: true,
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
              isSaving: false,
            }
            
      case SET_ATTRIBUTES:
        return {
          ...state,
          attributes: action.payload
        }

      case SET_COLUMNS:
        return {
          ...state,
          columns: action.payload
        }

      case SET_ENTRIES:
        return {
          ...state,
          entries: action.payload
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

        case SET_SHOW:
            return {
              ...state,
              show: action.payload
              }

        case SET_SLUG:
          return {
            ...state,
            slug: action.payload
          }

          case SET_TEMP:
            return {
              ...state,
              temp: action.payload
            }

            case SET_ENTITY_TYPE_ID:
              return {
                ...state,
                entity_type_id: action.payload
              }

              case SET_FORM_VALUES:  
              return {
                ...state,
                form: {
                  ...state?.form,
                  [action.payload.name]: action.payload.value
                }
              }
            

    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { 
    (async () => {
      try {
        dispatch({type: LOADING})
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}`);  
        const values = await valuesRaw.json();
  
        let attributes = [], columns = [], entries = [], entity_type_id = null;
  
        entries = values.data[0];
        columns = Object.keys(values.metadata.attributes);
        attributes = Object.values(values.metadata);
        entity_type_id = values.metadata.id;
  
        dispatch({type: SET_ATTRIBUTES, payload: attributes});
        dispatch({type: SET_COLUMNS, payload: columns});
        dispatch({type: SET_ENTRIES, payload: entries});
        dispatch({type: SET_ENTITY_TYPE_ID, payload: entity_type_id});

      } catch (ex) {
        console.error(ex.stack)
      } finally {
        dispatch({type: CLEANUP})
      }

    })();
  }, [entity_type_slug]);

  const onSubmit = useCallback((evt) => {
    evt.preventDefault();
    (async () => {
        try {
          dispatch({type: SAVING})
          const response = await slsFetch(`/api/${entity_type_slug}`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({entries: state.entries, columns: state.columns, slug: createSlug(state.slug), entity_type_id: state.entity_type_id})
          });
          const { message, homepage } = await response.json();      
          dispatch({type: SET_SHOW, payload: true})    
        } catch(ex) {
          console.error(ex);  
        } finally {
          dispatch({type: CLEANUP})
        }
    })();
  }, [state.entries, state.columns, state.slug, state.entity_type_id, entity_type_slug]);

  const createSlug = (slug) => {
    return slug.replaceAll(' ', '-').toLowerCase();
  }

  const onTextInputChange = (entries, col, value, attribute, attribute_type) => {
    entries[col] = value;
    entries[attribute] = attribute_type;
    dispatch({type: SET_ENTRIES, payload: entries});
  }

  return (
    <CacheContext.Provider value={cache}>
       <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
      <ContentManagerLayout>
      <div className="py-4">
        <AppBackButton link={`/admin/content-manager/${entity_type_slug}`} />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
          <div>
          <h3> Create an Entry </h3>
          <p> API ID : {entity_type_slug} </p>
          </div>
          <AppButtonLg title={state.isSaving ? 'Saving' : 'Save'} icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck />} onClick={onSubmit}/>
        </div>

        <div className="row mt-4">
          <div className="col-9">
          <div className="container_new_entry py-4 px-4"> 
          {state.isLoading && Array.from({length: DEFAULT_SKELETON_ROW_COUNT}, () => (
                <div>
                  <div className="skeleton-label" />
                  <div className="skeleton-text" />
                  <div />
                </div>
             ))}
          {
            !state.isLoading && (
              <>
              <p className="mt-1"> <b> slug </b></p>
            <input type='text'className="input_text mb-2" onChange={e => dispatch({type: SET_SLUG, payload: e.target.value})} />
            {state.attributes.map((attr, i) => (<div key={i}> 
              {state.columns.map((col, i) => attr[col] && (
                <div key={i}>
                  <p className="mt-1"> <b> {col} </b></p>
                  {attr[col].type === 'text' && (<input type="text" className="input_text mb-2" onChange={e => onTextInputChange(state.entries, col, e.target.value, `${col}_type`, attr[col].type)}/>)}
                  {attr[col].type === 'textarea' && (<textarea className='input_textarea' onChange={e => onTextInputChange(state.entries, col, e.target.value, `${col}_type`, attr[col].type)} />)}
                  {attr[col].type === 'float' && (<input type="number" className="input_text mb-2" onChange={e => onTextInputChange(state.entries, col, e.target.value, `${col}_type`, attr[col].type)}  />)}
                </div>
              ))}
            </div>))}
              </>
            )
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
         <AppInfoModal show={state.show} onClose={() => router.push(`/admin/content-manager/${entity_type_slug}`)} modalTitle='Success' buttonTitle='Close'> You have successfully created a new entry. </AppInfoModal>
      </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();

