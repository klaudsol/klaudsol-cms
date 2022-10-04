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

export default function CreateNewEntry({cache}) {

  const router = useRouter();

  const { entity_type_slug } = router.query;

  const initialState = {
    attributes: [],
    columns: [],
    entries: [],
    temp: [],
    form: [], 
    slug: null,
    isLoading: false,
    isRefresh: true,
    show: false,
  };

  const LOADING = 'LOADING';
  const REFRESH = 'REFRESH';
  const CLEANUP = 'CLEANUP';

  const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
  const SET_COLUMNS = 'SET_COLUMNS';
  const SET_ENTRIES = 'SET_ENTRIES';
  const SET_ENTITY_TYPE_NAME = 'SET_ENTITY_TYPE_NAME';
  const SET_FORM_VALUES = 'SET_FORM_VALUES';
  const SET_SHOW = 'SET_SHOW';
  const SET_SLUG = 'SET_SLUG';
  const SET_TEMP = 'SET_TEMP';

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

    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { 
    (async () => {
      const valuesRaw = await slsFetch(`/api/${entity_type_slug}`);  
      const values = await valuesRaw.json();

      let attributes = [], columns = [], entries = [];

      entries = values.data[0];
      columns = Object.keys(values.metadata.attributes);
      attributes = Object.values(values.metadata);

      dispatch({type: SET_ATTRIBUTES, payload: attributes});
      dispatch({type: SET_COLUMNS, payload: columns});
      dispatch({type: SET_ENTRIES, payload: entries});
      dispatch({type: SET_SLUG, payload: columns[0]});

    })();
  }, [entity_type_slug]);

  /*
  const onCreateEntry = useCallback((entries) => {
    (async () => {
      try {
        dispatch({type: LOADING});
         const response = await slsFetch(`/api/${entity_type_slug}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ entries })
        })
        const { message } = await response.json();
        dispatch({type: SET_SHOW, payload: true})
      }
      catch (ex) {  
        console.error(ex.stack);  
        alert(ex.stack);

      }finally {
        dispatch({type: CLEANUP});
      }
    })();
  }, []);*/

  const addSlash = (entry) => {
    return entry.replaceAll('\'', '\\\'')
  }

 const createEntry = (entries, attributes, columns) => {

    let temp = [];

    columns.map(col => {
      entries[`${col}_type`] === 'text' ? temp.push({value_string: entries[col]}) : null;
      entries[`${col}_type`] === 'textarea' ? temp.push({value_long_string: entries[col]}) : null;
      entries[`${col}_type`] === 'float' ? temp.push({value_double: entries[col]}) : null;
    })

    alert(JSON.stringify(temp));
    /*alert(JSON.stringify(Object.entries(entries).map(entry => {
      return
    })));*/
    /*alert(JSON.stringify(entries.map(entry => {
      return {
        ...entry,
        slug: createSlug(entries[state.slug]),
      }
    })));*/
    //alert(JSON.stringify(createSlug(entries[state.slug])));
  }

  const createSlug = (slug) => {
    return slug.replaceAll(' ', '-').toLowerCase();
  }

  return (
    <CacheContext.Provider value={cache}>
       <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
      <ContentManagerSubMenu title='Content'/>
      <InnerLayout title="Content">
      <div className="py-4">
        <AppBackButton link={`/admin/content-manager/${entity_type_slug}`} />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
          <div>
          <h3> Create an Entry </h3>
          <p> API ID : {entity_type_slug} </p>
          </div>
          <AppButtonLg title={state.isLoading ? 'Saving' : 'Save'} icon={state.isLoading ? <AppButtonSpinner /> : <FaCheck />} onClick={() => createEntry(state.entries, state.attributes, state.columns)} isDisabled={false}/>
        </div>

        <div className="row mt-4">
          <div className="col-9">
          <div className="container_new_entry py-4 px-4"> 
            {state.attributes.map((attr, i) => (<div key={i}> 
              {state.columns.map((col, i) => attr[col] && (
                <div key={i}>
                  <p className="mt-1"> <b> {col} </b></p>
                  {attr[col].type === 'text' && (<input type="text"  className="input_text mb-2" onChange={e => {
                    state.entries[col] = e.target.value;
                    state.entries[`${col}_type`] = attr[col].type;
                  }}
/>)}
                  {attr[col].type === 'textarea' && (<textarea className='input_textarea' onChange={
                    e=>{
                      state.entries[col]  = e.target.value;
                      state.entries[`${col}_type`] = attr[col].type;
                    }
                  } />)}
                  {attr[col].type === 'float' && (<input type="number" className="input_text mb-2" onChange={e => {
                    state.entries[col]  = e.target.value;
                    state.entries[`${col}_type`] = attr[col].type;
                  }}  />)}
                </div>
              ))}
            </div>))}
            {/*state.attributes.map(attribute => (
              <>
                <p className="mt-1"> <b>{attribute.name.toUpperCase()}</b> </p>
                {attribute.type === 'text' && <input type="text" name={attribute.type} className="input_text mb-2" onChange={e => {
                  attribute.value_string = `'${addSlash(e.target.value)}'`;
                }} />}
                {attribute.type === 'textarea' && <textarea name={attribute.type}  className='input_textarea'  onChange={e => {
                  attribute.value_long_string = `'${addSlash(e.target.value)}'`;
                }}/>}
                {attribute.type === 'float' && <input type="number" name={attribute.type}  className="input_text mb-2" onChange={e => {
                  attribute.value_double = `${e.target.value}`;
                }}/>}
              </>
            ))
              */}
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
         <AppInfoModal show={state.show} onClose={() => dispatch({type: SET_SHOW, payload: false})} modalTitle='Success' buttonTitle='Close'> You have successfully created a new entry. </AppInfoModal>
      </InnerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
