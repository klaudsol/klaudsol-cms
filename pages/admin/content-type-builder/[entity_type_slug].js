import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentBuilderSubMenu from "@/components/elements/inner/ContentBuilderSubMenu";
import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { FaTrash } from "react-icons/fa";

import React, { useEffect, useReducer, useContext, useRef } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { useRouter } from "next/router";

/** kladusol CMS components */
import AppContentBuilderTable from "@/components/klaudsolcms/AppContentBuilderTable";
import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSm from "@/components/klaudsolcms/buttons/AppButtonSm";
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppContentBuilderButtons from "@/components/klaudsolcms/buttons/AppContentBuilderButtons";
import AppModal from "@/components/klaudsolcms/AppModal";
import AddFieldBody from "@/components/klaudsolcms/modals/modal_body/AddFieldBody";
import AddEditAnotherFieldModal, {
  ADD_MODE,
} from "@/components/klaudsolcms/modals/AddEditAnotherFieldModal";

import IconText from "@/components/klaudsolcms/field_icons/IconText";
import IconNumber from "@/components/klaudsolcms/field_icons/IconNumber";
import IconMedia from "@/components/klaudsolcms/field_icons/IconMedia";

/** react-icons */
import { FaCheck, FaPlusCircle, FaPlus } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";
import ContentTypeBuilderLayout from "components/layouts/ContentTypeBuilderLayout";
import CollectionTypeBody from "@/components/klaudsolcms/modals/modal_body/CollectionTypeBody";
import EditCollectionTypeBody from "@/components/klaudsolcms/modals/modal_body/EditCollectionTypeBody";

import RootContext from "@/components/contexts/RootContext";
import { loadEntityTypes, loadEntityType } from "@/components/reducers/actions";
import {  writeContentTypes } from "@/lib/Constants";

export default function ContentTypeBuilder({ cache }) {
  const router = useRouter();

  const capabilities = cache?.capabilities;
  const { entity_type_slug } = router.query;
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const formikRef = useRef();

  const initialState = {
    show: false,
    attributes: [],
    columns: [],
    entity_type_name: null,
    isLoading: true,
  };

  const SET_SHOW = "SET_SHOW";
  const SET_ATTRIBUTES = "SET_ATTRIBUTES";
  const SET_ENTITY_TYPE_NAME = "SET_ENTITY_TYPE_NAME";
  const SHOW_DELETE_CONFIRMATION_MODAL = "SHOW_DELETE_CONFIRMATION_MODAL";
  const HIDE_DELETE_CONFIRMATION_MODAL = "HIDE_DELETE_CONFIRMATION_MODAL";
  const SHOW_EDIT_CONTENT_TYPE_MODAL = "SHOW_EDIT_CONTENT_TYPE_MODAL";
  const HIDE_EDIT_CONTENT_TYPE_MODAL = "HIDE_EDIT_CONTENT_TYPE";

  const LOADING = "LOADING";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_SHOW:
        return {
          ...state,
          show: action.payload,
        };

      case SET_ATTRIBUTES:
        return {
          ...state,
          attributes: action.payload,
        };

      case SET_ENTITY_TYPE_NAME:
        return {
          ...state,
          entity_type_name: action.payload,
        };

      case LOADING:
        return {
          ...state,
          isLoading: action.payload,
        };

      case SHOW_DELETE_CONFIRMATION_MODAL:
        return {
          ...state,
          showDeleteConfirmationModal: true,
        };

      case HIDE_DELETE_CONFIRMATION_MODAL:
        return {
          ...state,
          showDeleteConfirmationModal: false,
        };

      case SHOW_EDIT_CONTENT_TYPE_MODAL:
        return {
          ...state,
          showEditContentTypeModal: true,
        };
      case HIDE_EDIT_CONTENT_TYPE_MODAL:
        return {
          ...state,
          showEditContentTypeModal: false,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  /*** Entity Types List ***/
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: LOADING, payload: true });
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}`);
        const values = await valuesRaw.json();

        let attributes = [],
          columns = [],
          entries = [];

        columns = Object.keys(values.metadata.attributes);
        attributes = Object.values(values.metadata);

        attributes.map((attr) => {
          columns.map((col) => {
            attr[col]
              ? entries.push({
                  name: col,
                  type: attr[col].type,
                  button: <AppContentBuilderButtons />,
                })
              : null;
          });
        });

        dispatch({ type: SET_ATTRIBUTES, payload: entries });
      } catch (ex) {
        console.error(ex.stack);
      } finally {
        dispatch({ type: LOADING, payload: false });
      }
    })();
  }, [entity_type_slug]);

  const columns = [
    { accessor: "name", displayName: "NAME" },
    { accessor: "type", displayName: "TYPE" },
    { accessor: "button", displayName: "" },
  ];

  const entries = [
    {
      name: <IconText name="Name" />,
      type: "Text",
      button: <AppContentBuilderButtons isDisabled={false} />,
    },
    {
      name: <IconNumber name="Price" />,
      type: "Number",
      button: <AppContentBuilderButtons isDisabled={false} />,
    },
    {
      name: <IconMedia name="Image1" />,
      type: "Media",
      button: <AppContentBuilderButtons isDisabled={false} />,
    },
  ];

  const showDeleteModal = () => {
    dispatch({ type: SHOW_DELETE_CONFIRMATION_MODAL });
  };

  const showAddAttributeModal = () => {
    dispatch({ type: SET_SHOW, payload: true });
  };

  const hideAddAttributeModal = () => {
    dispatch({ type: SET_SHOW, payload: false });
  };

  const showEditContentTypeModal = () => {
    dispatch({ type: SHOW_EDIT_CONTENT_TYPE_MODAL });
  };

  const hideEditContentTypeModal = () => {
    dispatch({ type: HIDE_EDIT_CONTENT_TYPE_MODAL });
  };

  const performDelete = ({ typeSlug }) => {
    (async () => {
      try {
        dispatch({ type: LOADING, payload: true });
        await slsFetch(`/api/entity_types/${typeSlug}`, {
          method: "DELETE",
        });
        loadEntityTypes({ rootState, rootDispatch });
          
        router.push(`/admin`) 
      } catch (err) {
      } finally {
        dispatch({ type: HIDE_DELETE_CONFIRMATION_MODAL })
        dispatch({ type: LOADING, payload: false });   
      }
    })();
  };

  const onFormSubmit = (evt, callback = () => {}) => {
    evt.preventDefault();
    if (formikRef.current) {
      formikRef.current.handleSubmit();
      callback();
    }
  };

  const onEditContentTypeModal = (evt) => {
    onFormSubmit(evt, hideEditContentTypeModal);
  };

  const formikParams = {
    innerRef: formikRef,
    initialValues: {
      type: "text",
    },
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: LOADING, payload: true });
          const response = await slsFetch(
            `/api/entity_types/${entity_type_slug}/attributes`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                attribute: {
                  ...{ typeSlug: entity_type_slug },
                  ...values,
                },
              }),
            }
          );
        } catch (ex) {
          console.error(ex);
        } finally {
          //dispatch({type: CLEANUP})
          await loadEntityType({
            rootState,
            rootDispatch,
            typeSlug: entity_type_slug,
          });
          hideAddAttributeModal();
          dispatch({ type: LOADING, payload: false });
        }
      })();
    },
  };

  return (
    <CacheContext.Provider value={cache}>
      <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
        <ContentTypeBuilderLayout currentTypeSlug={entity_type_slug}>
          <div className="py-4">
            <AppBackButton link="/admin" />

            <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
              <div className="d-flex flex-row mb-2">
                <h3 className="my-1"> {entity_type_slug}</h3>
                <div className="mx-2" />
               {capabilities.includes(writeContentTypes) && <AppButtonSm
                  title="Edit"
                  icon={<MdModeEditOutline />}
                  isDisabled={false}
                  onClick={showEditContentTypeModal}
                />}
              </div>

              <div className="d-flex justify-content-between align-items-start mt-0 mx-0 px-0">
              {capabilities.includes(writeContentTypes) && <AppButtonLg
                  title="Add another field"
                  icon={<FaPlus />}
                  className="btn_create_entry"
                  onClick={showAddAttributeModal}
                />}
                {/* What is this for?
               <AppButtonLg title='Save' icon={<FaCheck />} isDisabled/>
              */}
                {capabilities.includes(writeContentTypes) && <AppButtonLg
                  title="Delete"
                  icon={<FaTrash />}
                  className="button_delete"
                  onClick={showDeleteModal}
                />}
              </div>
            </div>

            <p> Build the data architecture of your content. </p>

            {/*TODO: 
          <div className="d-flex justify-content-end align-items-center px-0 mx-0 pb-3"> 
            <AppButtonSm title='Configure the view' icon={<VscListSelection />} isDisabled={false}/>
          </div>
          */}

            <AppContentBuilderTable typeSlug={entity_type_slug} />
            
            <AddEditAnotherFieldModal
              mode={ADD_MODE}
              formParams={formikParams}
              show={state.show}
              onClose={() => dispatch({ type: SET_SHOW, payload: false })}
              onClick={onFormSubmit}
              isLoading={state.isLoading}
            />

            <AppModal
              show={state.showEditContentTypeModal}
              onClick={onEditContentTypeModal}
              onClose={hideEditContentTypeModal}
              modalTitle="Edit collection type"
              buttonTitle="Continue"
            >
              <EditCollectionTypeBody formRef={formikRef} />
            </AppModal>

            <AppModal
              show={state.showDeleteConfirmationModal}
              onClick={() => performDelete({ typeSlug: entity_type_slug })}
              onClose={() => dispatch({ type: HIDE_DELETE_CONFIRMATION_MODAL })}
              modalTitle="Confirm Delete"
              buttonTitle="Delete"
              isLoading={state.isLoading}
            >
              
              <div>Are you sure you want to delete this entity type?</div>
            </AppModal>
          </div>
        </ContentTypeBuilderLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
