import { useReducer, useEffect, useState, useContext, useRef} from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa'
import { slsFetch } from '@/components/Util'; 
import Link from 'next/link';
import AppIconButton from '@/components/klaudsolcms/buttons/AppIconButton'
import AppModal from '@/components/klaudsolcms/AppModal';
import CollectionTypeBody from '@/components/klaudsolcms/modals/modal_body/CollectionTypeBody';
import { DEFAULT_SKELETON_ROW_COUNT } from 'lib/Constants';
import RootContext from '@/components/contexts/RootContext';
import { SET_ENTITY_TYPES } from '@/components/reducers/actions';

const ContentBuilderSubMenu = ({title, currentTypeSlug}) => {

   const SET_SKELETON_VISIBLE = 'SET_SKELETON_VISIBLE';
   const SET_SHOW = 'SET_SHOW';

   const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
   const formRef = useRef();
   const onModalSubmit = () => {
      if(formRef.current) {
        formRef.current.handleSubmit();
        dispatch({type: SET_SHOW, payload: false});
      }
   };
  
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
      ],
      selectedType: 1,
      show: false,
      isLoading: false,
    };

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
          case SET_SHOW:
              return {
                ...state,
                show: action.payload
                }

          case SET_SKELETON_VISIBLE:
            return {
              ...state,
              isSkeletonVisible: action.payload
            }
      }
    };
    
    const [state, dispatch] = useReducer(reducer, initialState);

    /*** Entity Types List ***/
    useEffect(() => { 
      (async () => {

        try {  

          //load only if there is no data in the root context cache
          if (!rootState.entityTypes || rootState.entityTypes.length === 0) dispatch({type: SET_SKELETON_VISIBLE, payload: true});

          const entityTypesRaw = await slsFetch('/api/entity_types');  
          const entityTypes = await entityTypesRaw.json();

          //reload entity types list only if there is a change.
          if(rootState.entityTypesHash !== entityTypes.metadata.hash) { 
            rootDispatch({type: SET_ENTITY_TYPES, payload: {
                entityTypes: entityTypes.data,
                entityTypesHash: entityTypes.metadata.hash
            }});
          }
        
      } catch (ex) {
          console.error(ex.stack)
        } finally {
          dispatch({type: SET_SKELETON_VISIBLE, payload: false})
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
              {state.isSkeletonVisible && Array.from({length: DEFAULT_SKELETON_ROW_COUNT}, (_,i) => (
             
              <div key={i} className='d-flex flex-row align-items-center justify-content-start skeleton-submenu'>
                <div className='skeleton-bullet'/>
                <div className='skeleton-submenu-text' />
              </div>

              ))}

              { !state.isSkeletonVisible &&
                rootState.entityTypes.map((type, i) => (
                   <Link href={`/admin/content-type-builder/${type.entity_type_slug}`} passHref key={i}>
                     <button data-current-type-slug={currentTypeSlug} key={i} className={currentTypeSlug === type.entity_type_slug ? 'content_menu_item_active' : 'content_menu_item'}>
                       <li> {type.entity_type_name}</li>
                      </button>
                    </Link>
                ))
              }
                 <button onClick={() => dispatch({type: SET_SHOW, payload: true})} className='content_create_button'> <FaPlus className='content_create_icon' /> Create new collection type </button>
            </div>

           
            
        </div>
        <AppModal show={state.show} 
          onClose={() => dispatch({type: SET_SHOW, payload: false})} 
          onClick={onModalSubmit} 
          modalTitle='Create a collection type' buttonTitle='Continue'> 
          <CollectionTypeBody formRef={formRef} />
        </AppModal>
    </> 
    );
}
 
export default ContentBuilderSubMenu;