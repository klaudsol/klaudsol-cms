import { useReducer} from 'react';

/** kladusol CMS components */
import AppIconButton from '@/components/klaudsolcms/buttons/AppIconButton'

/** react icons */
import { FaSearch } from 'react-icons/fa'

const ContentManagerSubMenu = ({title}) => {

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
               <p className="type_number"> {state.collectionTypes.length} </p>
            </div>

            <div className="d-flex flex-column mx-0 px-0">
               {
                  state.collectionTypes.map((type, i) => (
                     <button key={i} className={state.selectedType === type.id ? 'content_menu_item_active' : 'content_menu_item'} onClick={() => dispatch({type: SET_SELECTED_TYPE, payload: type.id})}>
                        <li> {type.title} </li>
                     </button>
                  ))
               }
            </div>
            
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
        </div>
    </> 
    );
}
 
export default ContentManagerSubMenu;