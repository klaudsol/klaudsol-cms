import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentBuilderSubMenu from '@/components/elements/inner/ContentBuilderSubMenu';
import { getSessionCache } from "@/lib/Session";

import React, { useEffect, useReducer } from 'react';
import { slsFetch } from '@/components/Util'; 
import { useRouter } from 'next/router';

/** kladusol CMS components */
import AppContentBuilderTable from '@/components/klaudsolcms/AppContentBuilderTable'
import AppCreatebutton from '@/components/klaudsolcms/buttons/AppCreateButton'
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'
import AppButtonSm from '@/components/klaudsolcms/buttons/AppButtonSm'
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppContentBuilderButtons from '@/components/klaudsolcms/buttons/AppContentBuilderButtons'
import AppModal from '@/components/klaudsolcms/AppModal';
import AddFieldBody from '@/components/klaudsolcms/modals/modal_body/AddFieldBody';

import IconText from '@/components/klaudsolcms/field_icons/IconText';
import IconNumber from '@/components/klaudsolcms/field_icons/IconNumber';
import IconMedia from '@/components/klaudsolcms/field_icons/IconMedia';

/** react-icons */
import { FaCheck, FaPlusCircle } from 'react-icons/fa';
import { MdModeEditOutline } from 'react-icons/md';
import { VscListSelection } from 'react-icons/vsc';

export default function ContentTypeBuilder({cache}) {
  const router = useRouter();
  const { entity_type_slug } = router.query;

  const initialState = {
    show: false,
    attributes: [],
    entity_type_name: null,
  };

  const SET_SHOW = 'SET_SHOW';
  const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
  const SET_ENTITY_TYPE_NAME = 'SET_ENTITY_TYPE_NAME';

  const reducer = (state, action) => {
    
    switch(action.type) {
        case SET_SHOW:
            return {
              ...state,
              show: action.payload
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
    }
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);

    /*** Entity Types List ***/
    useEffect(() => { 
      (async () => {
        const attributesRaw = await slsFetch(`/api/klaudsolcms/attributes/${entity_type_slug}`);  
        const attributes = await attributesRaw.json();

            
        dispatch({type: SET_ENTITY_TYPE_NAME, payload: attributes[0].entity_type_name});
       
       
        dispatch({type: SET_ATTRIBUTES, payload: attributes.map(attribute => {
          return {
            name: attribute.attributes_name, 
            type: attribute.attributes_type,
          }
        })});

      })();
    }, [entity_type_slug]);
  const columns = [
    { accessor: "name", displayName: "NAME", },
    { accessor: "type", displayName: "TYPE", },
    { accessor: "button", displayName: "", },
  ];

  const entries = [
      {name: <IconText name='Name' /> , type: 'Text', button: <AppContentBuilderButtons />},
      {name: <IconNumber name='Price' /> , type: 'Number',  button: <AppContentBuilderButtons /> },
      {name: <IconMedia name='Image1' /> , type: 'Media',  button: <AppContentBuilderButtons /> }
  ]

  
  return (
    <CacheContext.Provider value={cache}>
      <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
      <ContentBuilderSubMenu title='Content-Type Builder'/>
      <InnerLayout>
      <div className="py-4">
        <AppBackButton link='/admin' />

        <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
          <div className="d-flex flex-row mb-2">
          <h3 className="my-1"> {state.entity_type_name} </h3>
          <div className="mx-2" />
          <AppButtonSm title='Edit' icon={<MdModeEditOutline />} isDisabled={false}/>
          </div>
  
          <div className="d-flex justify-content-between align-items-start mt-0 mx-0 px-0">
            <AppCreatebutton title='Add another field' />
            <AppButtonLg title='Save' icon={<FaCheck />} isDisabled/>
          </div>
        </div>

        <p>  Build the data architecture of your content  </p>

        <div className="d-flex justify-content-end align-items-center px-0 mx-0 pb-3"> 
          <AppButtonSm title='Configure the view' icon={<VscListSelection />} isDisabled={false}/>
        </div>

        <AppContentBuilderTable columns={columns} entries={state.attributes} />
        <button className="btn_add_field" onClick={() => dispatch({type: SET_SHOW, payload: true})}> <FaPlusCircle className="btn_add_field_icon mr-2" /> Add another field collection type </button>

        <AppModal show={state.show} onClose={() => dispatch({type: SET_SHOW, payload: false})} modalTitle='Type' buttonTitle='Continue'> 
          <AddFieldBody />
        </AppModal>
    </div>
      </InnerLayout>
      </div>
      </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();