import { useReducer, useEffect, useContext } from 'react';
import { slsFetch } from '@/components/Util'; 
import RootContext from '@/components/contexts/RootContext';
import Link from 'next/link';

/** kladusol CMS components */
import AppIconButton from '@/components/klaudsolcms/buttons/AppIconButton'
import { SET_ENTITY_TYPES } from '@/components/reducers/actions';

/** react icons */
import { FaSearch } from 'react-icons/fa'

const ContentManagerSubMenu = ({title, defaultType}) => {
  
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

   const initialState = {
      collectionTypes: [
         {title: 'Menu', id: 1},
         {title: 'Users', id: 2},
         {title: 'Article', id: 3}
      ],
      singleTypes: [
         {title: 'Test', id:4},
         {title: 'Test', id:5}
      ],
      selectedType: 1
    };

    const SET_SELECTED_TYPE = 'SET_SELECTED_TYPE';

    const reducer = (state, action) => {
      
      switch(action.type) {
         case SET_SELECTED_TYPE:
          return {
            ...state,
            selectedType: action.payload
          }
      }
    };
    
    const [state, dispatch] = useReducer(reducer, initialState);

    /*** Entity Types List ***/
    useEffect(() => { 
      (async () => {
        const entityTypesRaw = await slsFetch('/api/entity_types');  
        const entityTypes = await entityTypesRaw.json();
        
        //reload entity types list only if there is a change.
        if(rootState.entityTypesHash !== entityTypes.metadata.hash) {
            rootDispatch({type: SET_ENTITY_TYPES, payload: {
                entityTypes: entityTypes.data,
                entityTypesHash: entityTypes.metadata.hash
            }});
        }
      })();
    }, [rootState]);


    return ( 
    <>
         <div className="submenu_container">
            <div className="px-3 py-3">
            <div className='d-flex justify-content-between align-items-center mx-0 px-0 my-0 py-0'>
                <a className='submenu_title'> <b> {title}</b> </a>
                <AppIconButton icon={<FaSearch className='search_icon'/>} /> 
                </div>
               <div className="submenu_bar"></div>
            </div>
           
            <div className="d-flex justify-content-between align-items-center px-3 pt-2">
               <p className="content_manager_type_title"> COLLECTION TYPES </p>
               <p className="type_number"> {rootState.entityTypes.length} </p>
            </div>

            <div className="d-flex flex-column mx-0 px-0">
               {
                  rootState.entityTypes.map((type, i) => (
                     <Link href={`/admin/content-manager/${type.entity_type_slug}`} passHref key={i}><button key={i} className={state.selectedType === type.entity_type_id ? 'content_menu_item_active' : 'content_menu_item'} onClick={() => dispatch({type: SET_SELECTED_TYPE, payload: type.entity_type_id})}><li> {type.entity_type_name} </li></button></Link>
                  ))
               }
            </div>
            
            {
               /*
 <div className="d-flex justify-content-between align-items-center px-3 pt-2">
               <p className="content_manager_type_title"> SINGLE TYPES </p>
               <p className="type_number"> {state.singleTypes.length} </p>
            </div>

            <div className="d-flex flex-column mx-0 px-0">
               {
                  state.singleTypes.map((type, i) => (
                     <button key={i} className={state.selectedType === type.id ? 'content_menu_item_active' : 'content_menu_item'} onClick={() => dispatch({type: SET_SELECTED_TYPE, payload: type.id})}>
                        <li> {type.title} </li>
                     </button>
                  ))
               }
            </div>
               */
            }
           
        </div>
    </> 
    );
}
 
export default ContentManagerSubMenu;