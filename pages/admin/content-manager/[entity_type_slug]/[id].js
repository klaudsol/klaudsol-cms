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
import { redirectToManagerEntitySlug } from "@/components/klaudsolcms/routers/routersRedirect";
import 
{ initialState,
  reducer, 
  LOADING,
  SAVING,
  DELETING,
  CLEANUP,
  SET_ATTRIBUTES,
  SET_SHOW,
  SET_MODAL_CONTENT,
  SET_VALUES,
  SET_COLUMNS,
  SET_ENTITY_TYPE_ID,
  SET_ENTITY_TYPE_ID_PARENT} from "components/reducers/editAndDeleteReducer";


export default function Type({cache}) {
  const router = useRouter();

  const { entity_type_slug, id } = router.query;
  
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
        let entries, attributes, columns, entity_type_id_parent, entity_type_id;
  
        entries = values.data;
        columns = Object.keys(values.metadata.attributes);
        attributes = Object.values(values.metadata);
        entity_type_id_parent = values.metadata.entity_type_id_parent;
        entity_type_id = values.metadata.entity_type_id;
        
        
        dispatch({type: SET_ENTITY_TYPE_ID_PARENT, payload: entity_type_id_parent});
        dispatch({type: SET_ENTITY_TYPE_ID, payload: entity_type_id});
        dispatch({type: SET_ATTRIBUTES, payload: attributes});
        dispatch({type: SET_COLUMNS, payload: columns});
        dispatch({type: SET_VALUES, payload: entries});
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
            body: JSON.stringify({entries: state.values, entity_type_id: state.entity_type_id_parent, entity_id: state.entity_type_id })
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
  }, [state.values, id, entity_type_slug, state.entity_type_id_parent,state.entity_type_id]);

  const onDelete = useCallback((evt) => {
    evt.preventDefault();
    (async () => {
        try {

          dispatch({type: DELETING})
          const response = await slsFetch(`/api/${entity_type_slug}/${state.entity_type_id}`, {
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
  }, [entity_type_slug, state.entity_type_id]);
 
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
            {state.isLoading && Array.from({length: DEFAULT_SKELETON_ROW_COUNT}, (_, i) => (
                <div key={i}>
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
         <AppInfoModal show={state.show} 
                       onClose={() => 
                       (dispatch({type: SET_SHOW, payload: false}),
                       redirectToManagerEntitySlug(router,entity_type_slug) 
                       )}  
                       modalTitle='Success' 
                       buttonTitle='Close'> 
                       {state.modalContent} 
                       </AppInfoModal>
         
      </ContentManagerLayout>
      </div>
      </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
