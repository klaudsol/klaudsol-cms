import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from '@/components/elements/inner/ContentManagerSubMenu';
import { getSessionCache } from "@/lib/Session";

import { useRouter } from 'next/router'
import { useEffect, useReducer, useCallback } from 'react';
import { slsFetch } from '@/components/Util'; 

/** kladusol CMS components */
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'
import AppButtonSpinner from '@/components/klaudsolcms/AppButtonSpinner';
import AppInfoModal from '@/components/klaudsolcms/modals/AppInfoModal';

/** react-icons */
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from 'react-icons/md';
import { VscListSelection } from 'react-icons/vsc';
import { Col } from "react-bootstrap";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { DEFAULT_SKELETON_ROW_COUNT } from "lib/Constants";


export default function Type({cache}) {
  const router = useRouter();

  const { entity_type_slug, id } = router.query;
  
  const initialState = {
    values: [],
    attributes: [],
    columns: [],
    entity_type_name: null,
    isLoading: false,
    isRefresh: true,
    isSaving: false,
    isDeleting: false,
    show: false,
    entity_type_id: null,
    modalContent: null,
  };

  const LOADING = 'LOADING';
  const REFRESH = 'REFRESH';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CLEANUP = 'CLEANUP';
  const SET_SHOW = 'SET_SHOW';
  const SET_MODAL_CONTENT = 'SET_MODAL_CONTENT';

  const SET_VALUES = 'SET_VALUES';
  const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
  const SET_COLUMNS = 'SET_COLUMNS';
  const SET_ENTITY_TYPE_NAME = 'SET_ENTITY_TYPE_NAME';
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

        case DELETING:
              return {
                ...state,
                isDeleting: true,
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
              isDeleting: false,
            }

        case SET_SHOW:
              return {
                ...state,
                show: action.payload,
              }
            
      case SET_VALUES:
        return {
          ...state,
          values: action.payload
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

      case SET_ENTITY_TYPE_NAME:
        return {
          ...state,
          entity_type_name: action.payload
        }

        case SET_ENTITY_TYPE_ID:
          return {
            ...state,
            entity_type_id: action.payload
          }

          case SET_MODAL_CONTENT:
            return {
              ...state,
              modalContent: action.payload
            }


    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const onTextInputChange = (entries, col, value, attribute, attribute_type) => {
    entries[col] = value;
    entries[attribute] = attribute_type;
    dispatch({type: SET_VALUES, payload: entries});
  }

  /*** Entity Types List ***/
  useEffect(() => { 
    (async () => {
      try {
        dispatch({type: LOADING})
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}/${id}`);  
        const values = await valuesRaw.json();
        let entries, attributes, columns, entity_type_id;
  
        entries = values.data;
        columns = Object.keys(values.metadata.attributes);
        attributes = Object.values(values.metadata);
        entity_type_id = values.metadata.entity_type_id;
  
        dispatch({type: SET_ATTRIBUTES, payload: attributes});
        dispatch({type: SET_COLUMNS, payload: columns});
        dispatch({type: SET_VALUES, payload: entries});
        dispatch({type: SET_ENTITY_TYPE_ID, payload: entity_type_id});
      } catch (ex) {
        console.error(ex.stack)
      } finally {
        dispatch({type: CLEANUP})
      }
    


    })();
  }, [entity_type_slug, id]);

  const onSubmit = useCallback((evt) => {
    evt.preventDefault();
    (async () => {
        try {
          dispatch({type: SAVING})
          const response = await slsFetch(`/api/${entity_type_slug}/${id}`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({entries: state.values, entity_type_id: state.entity_type_id, entity_id: id })
          });
          const { message, homepage } = await response.json();    
          dispatch({type: SET_MODAL_CONTENT, payload: 'You have successfully edited the entry.'})      
          dispatch({type: SET_SHOW, payload: true})    

        } catch(ex) {
          console.error(ex);  
        } finally {
          dispatch({type: CLEANUP})
        }
    })();
  }, [state.values, state.columns, id, entity_type_slug, state.entity_type_id]);

  const onDelete = useCallback((evt) => {
    evt.preventDefault();
    (async () => {
        try {
          dispatch({type: DELETING})
          const response = await slsFetch(`/api/${entity_type_slug}/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json'
            },
          });
          const { message, homepage } = await response.json();   
          dispatch({type: SET_MODAL_CONTENT, payload: 'You have successfully deleted the entry.'})   
          dispatch({type: SET_SHOW, payload: true}) 
          
        } catch(ex) {
          console.error(ex);  
        } finally {
          dispatch({type: CLEANUP})
        }
    })();
  }, [entity_type_slug, id]);
 
  return (
    <CacheContext.Provider value={cache}>
      <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
      <ContentManagerLayout>
      <div className="py-4">
        <AppBackButton link={`/admin/content-manager/${entity_type_slug}`} />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
          <div>
          <h3> {entity_type_slug} </h3>
          <a href={`/api/${entity_type_slug}/${id}`} passHref target='_blank' rel="noreferrer">api/{entity_type_slug}/{id}</a>
          <p> API ID : {id} </p>
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
            { !state.isLoading &&
          state.attributes.map((attr, i) => (<div key={i}> {
            state.columns.map((col, i) => attr[col] && (
            <div key={i}>
              <p className="mt-1"> <b>{col}</b> </p>
              {/*Note: this is just a quick and dirty fix. Long term fix is to use the AdminRenderer component*/}
              {(attr[col].type === 'text' || attr[col].type === 'image' ||attr[col].type === 'link') && (<input type="text"  className="input_text mb-2" defaultValue={state.values[col]} onChange={e => onTextInputChange(state.values, col, e.target.value, `${col}_type`, attr[col].type)}/>)}
              {attr[col].type === 'textarea' && (<textarea className='input_textarea' defaultValue={state.values[col]} onChange={e => onTextInputChange(state.values, col, e.target.value, `${col}_type`, attr[col].type)}/>)}
              {attr[col].type === 'float' && (<input type="number" className="input_text mb-2" defaultValue={state.values[col]} onChange={e => onTextInputChange(state.values, col, e.target.value, `${col}_type`, attr[col].type)}/>)}
            </div>
            ))
          } </div>))
        }
            </div>
          </div>
          <div className="col-3 mx-0">
            <div className="container_new_entry edit_new_entry px-3 py-4"> 
               <p style={{fontSize: '11px'}}> INFORMATION </p>
               <div className="block_bar"></div>
             
              <div className="d-flex align-items-center justify-content-between mt-4">
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
            {/* <button className="new_entry_block_button mt-2">  <MdModeEditOutline  className='icon_block_button' /> Edit the model </button>
            <button className="new_entry_block_button mt-2">  <VscListSelection  className='icon_block_button' /> Configure the view </button> */}
            <button className="new_entry_block_button_delete mt-2" onClick={onDelete}>  {state.isDeleting ? <><AppButtonSpinner />  Deleting... </> : <>
            <FaTrash  className='icon_block_button' /> Delete the entry
            </> }</button>
          </div>
          
        </div>
         </div>
         <AppInfoModal show={state.show} onClose={() => (dispatch({type: SET_SHOW, payload: false}) ,router.push(`/admin/content-manager/${entity_type_slug}`) )} modalTitle='Success' buttonTitle='Close'> {state.modalContent} </AppInfoModal>
         
      </ContentManagerLayout>
      </div>
      </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
