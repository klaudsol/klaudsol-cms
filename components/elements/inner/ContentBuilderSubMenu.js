import { useReducer, useEffect, useState} from 'react';
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Button, Card, Collapse } from 'reactstrap';
import { slsFetch } from '@/components/Util'; 
import Link from 'next/link';
import AppIconButton from '@/components/klaudsolcms/buttons/AppIconButton'
import AppModal from '@/components/klaudsolcms/AppModal';
import CollectionTypeBody from '@/components/klaudsolcms/modals/modal_body/CollectionTypeBody';
const ContentBuilderSubMenu = ({title}) => {

   const [collapseOpen, setCollapseOpen] = useState(true);
   const [types, setTypes] = useState([
      {typeName: 'COLLECTION TYPES', collapseOpen: true},
      {typeName: 'SINGLE TYPES', collapseOpen: true},
      {typeName: 'COMPONENTS', collapseOpen: true},
   ])

   const initialState = {
      entityTypes: [],
      subTypes: [
         {mainType: 'COLLECTION TYPES', typeName: 'Menu'},
         {mainType: 'COLLECTION TYPES', typeName: 'User'},
      ],
      selectedType: 1,
      show: false,
    };

    const SET_SELECTED_TYPE = 'SET_SELECTED_TYPE';
    const SET_ENTITY_TYPES = 'SET_ENTITY_TYPES';
    const SET_SHOW = 'SET_SHOW';

    function onCollapse(name){
      var type = types;
      type.map((type) => {
        if(type.typeName == name){
          type.collapseOpen = !type.collapseOpen
        }
      })
      setTypes(type);
      setCollapseOpen(!collapseOpen);
    }

    const reducer = (state, action) => {
      
      switch(action.type) {
         case SET_SELECTED_TYPE:
          return {
            ...state,
            selectedType: action.payload
          }

          case SET_SHOW:
              return {
                ...state,
                show: action.payload
                }

          case SET_ENTITY_TYPES:
                  return {
                    ...state,
                    entityTypes: action.payload
                  }
      }
    };
    
    const [state, dispatch] = useReducer(reducer, initialState);

      /*** Entity Types List ***/
      useEffect(() => { 
        (async () => {
          const entityTypesRaw = await slsFetch('/api/entity_types');  
          const entityTypes = await entityTypesRaw.json();
          dispatch({type: SET_ENTITY_TYPES, payload: entityTypes.data});
        })();
      }, []);

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
               <p className="type_number"> {state.entityTypes.length} </p>
            </div>

            <div className="d-flex flex-column mx-0 px-0">
               {
                  state.entityTypes.map((type, i) => (
                     <Link href={`/admin/plugins/content-type-builder/${type.entity_type_slug}`} passHref key={i}><button key={i} className={state.selectedType === type.entity_type_id ? 'content_menu_item_active' : 'content_menu_item'} onClick={() => dispatch({type: SET_SELECTED_TYPE, payload: type.entity_type_id})}><li> {type.entity_type_name} </li></button></Link>
                  ))
               }
                 <button onClick={() => dispatch({type: SET_SHOW, payload: true})} className='content_create_button'> <FaPlus className='content_create_icon' /> Create new collection type </button>
            </div>

           
            
        </div>
        <AppModal show={state.show} onClose={() => dispatch({type: SET_SHOW, payload: false})} modalTitle='Create a collection type' buttonTitle='Continue'> 
          <CollectionTypeBody />
        </AppModal>
    </> 
    );
}
 
export default ContentBuilderSubMenu;