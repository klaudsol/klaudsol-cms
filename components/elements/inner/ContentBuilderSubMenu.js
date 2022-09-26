import { useReducer} from 'react';
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Button, Card, Collapse } from 'reactstrap';
import { useState } from 'react';
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
      subTypes: [
         {mainType: 'COLLECTION TYPES', typeName: 'Menu'},
         {mainType: 'COLLECTION TYPES', typeName: 'User'},
         {mainType: 'SINGLE TYPES', typeName: 'Food'},
         {mainType: 'COMPONENTS', typeName: 'Article'},
      ],
      selectedType: 0,
      show: false,
    };

    const SET_SELECTED_TYPE = 'SET_SELECTED_TYPE';
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

            <div className=''>
              {types.map((type) => (
                <>
                  <Button
                     className='type_title'
                     onClick={() => onCollapse(type.typeName)}>
                     <div className="d-flex justify-content-between align-items-center px-3 pt-2">
                        <p> {type.typeName}  {!type.collapseOpen ? <FaChevronDown className="type_title_icon"/> : <FaChevronUp className="type_title_icon"/> } </p>
                        <p className="type_number"> {state.subTypes.filter(subType => subType.mainType === type.typeName).length} </p>
                     </div>
                   </Button>
                   <Collapse isOpen={type.collapseOpen}>
                    {state.subTypes.map((sub_type, i) => (
                      <>
                      {
                        sub_type.mainType == type.typeName && (
               
                          <button className={state.selectedType === i ? 'content_menu_item_active' : 'content_menu_item'} key={i}  onClick={() => dispatch({type: SET_SELECTED_TYPE, payload: i})}>
                        <li> {sub_type.typeName} </li>
                     </button>
       
                       )
                      }
                        </>
                     ))}
                   </Collapse>
                   <button onClick={() => dispatch({type: SET_SHOW, payload: true})} className='content_create_button'> <FaPlus className='content_create_icon' /> Create new {type.typeName.toLowerCase()} </button>
                </>
              ))}
          </div>
           
            
        </div>
        <AppModal show={state.show} onClose={() => dispatch({type: SET_SHOW, payload: false})} modalTitle='Create a collection type' buttonTitle='Continue'> 
          <CollectionTypeBody />
        </AppModal>
    </> 
    );
}
 
export default ContentBuilderSubMenu;