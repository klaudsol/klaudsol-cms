import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from "@/components/elements/inner/ContentManagerSubMenu";

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks";

import { useRouter } from "next/router";
import { useEffect, useReducer, useCallback, useRef } from "react";
import { sortByOrderAsc } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";

/** kladusol CMS components */
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

/** react-icons */
import { FaCheck, FaPencilRuler, FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";
import { Col } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { DEFAULT_SKELETON_ROW_COUNT, writeContents } from "lib/Constants";
import { getAllFiles, getNonFiles, extractFiles } from "@/lib/s3FormController";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { redirectToManagerEntitySlug } from "@/components/klaudsolcms/routers/routersRedirect";
import classname from "classnames";

import {
  initialState,
  entityReducer,
} from "@/components/reducers/entityReducer";

import {
  LOADING,
  REFRESH,
  SAVING,
  DRAFTING,
  DELETING,
  CLEANUP,
  SET_SHOW,
  SET_MODAL_CONTENT,
  SET_VALUES,
  SET_ATTRIBUTES,
  SET_COLUMNS,
  SET_ENTITY_TYPE_NAME,
  SET_ENTITY_TYPE_ID,
  SET_ALL_VALIDATES
} from "@/lib/actions";
import GeneralHoverTooltip from "@/components/elements/tooltips/GeneralHoverTooltip";
import { RiQuestionLine } from "react-icons/ri";
import { slugTooltipText } from "@/constants";

export default function Type({ cache }) {
  const router = useRouter();
  const errorHandler = useClientErrorHandler();
  const capabilities = cache?.capabilities;

  const { entity_type_slug, slug } = router.query;
  const [state, dispatch] = useReducer(entityReducer, initialState);
  const formRef = useRef();
  const statusRef = useRef();

  /*** Entity Types List ***/
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: LOADING });
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}/${slug}?drafts=true`);
        const values = await valuesRaw.json();

        const entries = {...Object.keys(values.metadata.attributes).reduce((a, v) => ({ ...a, [v]: ''}), {}), ...values.data};
        const attributes = values.metadata.attributes;
        const entity_type_id = values.metadata.entity_type_id;
        const validateValues = Object.keys(values.metadata.attributes).reduce((a, v) => ({ ...a, [v]: true}), {})
    
        dispatch({type: SET_ALL_VALIDATES, payload: validateValues});
        dispatch({ type: SET_ATTRIBUTES, payload: attributes });
        dispatch({ type: SET_VALUES, payload: entries });
        dispatch({ type: SET_ENTITY_TYPE_ID, payload: entity_type_id });
      } catch (ex) {
        errorHandler(ex);
      } finally {
        dispatch({ type: CLEANUP });
      }
    })();
  }, [entity_type_slug, slug]);

  const onSubmit = (e) => {
    e.preventDefault();
    formRef.current.handleSubmit();
    state.allValidates && formRef.current.setTouched({ ...state.allValidates});
  };

  const onDelete = useCallback(
    (evt) => {
      evt.preventDefault();
      (async () => {
        try {
          dispatch({ type: DELETING });
          const response = await slsFetch(`/api/${entity_type_slug}/${slug}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          });
          const { message, homepage } = await response.json();
          dispatch({
            type: SET_MODAL_CONTENT,
            payload: "You have successfully deleted the entry.",
          });
          dispatch({ type: SET_SHOW, payload: true });
        } catch (ex) {
          errorHandler(ex);
        } finally {
          dispatch({ type: CLEANUP });
        }
      })();
    },
    [entity_type_slug, slug]
  );

  const onPublishSubmit = (e) => {
    statusRef.current = "published";

    dispatch({ type: SAVING });

    onSubmit(e);
  }

  const onDraftSubmit = (e) => {
    statusRef.current = "draft";

    dispatch({ type: DRAFTING });

    onSubmit(e)
  }

  const formikParams = {
    innerRef: formRef,
    initialValues: state.values,
    onSubmit: (values) => {
      (async () => {
        try {
          console.error(values);

          const { data, fileNames, files } = await extractFiles(values);

          const entry = {
            ...data,
            fileNames,
            entity_type_slug,
            entity_id: id,
            status: statusRef.current
          };

          const response = await slsFetch(`/api/${entity_type_slug}/${slug}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(entry),
          });

          const { message, presignedUrls } = await response.json();

          if (files.length > 0) await uploadFilesToUrl(files, presignedUrls);

          dispatch({
            type: SET_MODAL_CONTENT,
            payload: "You have successfully edited the entry.",
          });
          dispatch({ type: SET_SHOW, payload: true });
        } catch (ex) {
          errorHandler(ex);
        } finally {
          dispatch({ type: CLEANUP });
        }
      })();
    },
  };
//{capabilities.includes(writeContents) ?
//: <p className="errorMessage">forbidden.</p>}

  return (
    <CacheContext.Provider value={cache}>
      <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
        <ContentManagerLayout currentTypeSlug={entity_type_slug}>
            <div className="py-4">
              <AppBackButton link={`/admin/content-manager/${entity_type_slug}`} />
            <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
              <div>
                <div className="general-header"> {entity_type_slug} </div>
                <a
                  href={`/api/${entity_type_slug}/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  api/{entity_type_slug}/{slug}
                </a>
              </div>
              {(!state.isLoading && capabilities.includes(writeContents)) && 
                <AppButtonLg
                title={state.isDeleting ? "Deleting" : "Delete"}
                icon={state.isDeleting ? <AppButtonSpinner /> : <FaTrash className="general-button-icon"/>}
                onClick={!state.isSaving ? onDelete : null} // Add confirmation modal before deleting the entry
                className="general-button-delete"
              />
              }
            </div>
            <div className="row mt-4 mx-0 px-0">
              <div className="col-12 mx-0 px-0 mb-2">
                <div className="py-0 px-0 mb-3">
                  {state.isLoading &&
                    Array.from(
                      { length: DEFAULT_SKELETON_ROW_COUNT },
                      (_, i) => (
                        <div key={i}>
                          <div className="skeleton-label" />
                          <div className="skeleton-text" />
                          <div />
                        </div>
                      )
                    )}

                  {!state.isLoading && (
                    <Formik {...formikParams}>
                      {(props) => (
                        <Form>
                          <div className="d-flex flex-row mx-0 my-0 px-0 py-0"> 
                          <p className="general-input-title-slug">Slug</p> 
                          <GeneralHoverTooltip 
                            icon={<RiQuestionLine className="general-input-title-slug-icon"/>}
                            className="general-table-header-slug"
                            tooltipText={slugTooltipText}
                            position="left"
                          /> 
                          </div>
                          <div>
                            <Field name="slug" type="text" className="general-input-text" />
                          </div>
                          {Object.entries(state.attributes)
                            .sort(sortByOrderAsc)
                            .map(([attributeName, attribute]) => {
                              return (
                                <div key={attributeName}>
                                  <p className="general-input-title"> {attributeName.replaceAll('_', " ")}  </p>
                                  <AdminRenderer
                                    errors={props.errors}
                                    touched={props.touched}
                                    type={attribute.type}
                                    name={attributeName}
                                    customName={attribute?.custom_name ?? ''}
                                    disabled={!capabilities.includes(writeContents)}
                                    id={state.values.id}
                                  />
                                </div>
                              );
                            })}
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              </div>
              <div className="col-3 mx-0">
                {/* <div className="container_new_entry px-3 py-4">
                  <p style={{ fontSize: "11px" }}> INFORMATION </p>
                  <div className="block_bar"></div>

                  <div className="d-flex align-items-center justify-content-between mt-4">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> Created </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> 2 days ago </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> By </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> Ardee Aram </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> 2 days ago </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> Ardee Aram </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> By </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> </p>
                  </div>
                </div> */}
                {/* <button className="new_entry_block_button mt-2">  <MdModeEditOutline  className='icon_block_button' /> Edit the model </button>
            <button className="new_entry_block_button mt-2">  <VscListSelection  className='icon_block_button' /> Configure the view </button> */}

              </div>
            </div>
            {!state.isLoading && 
            <div className="d-flex flex-row justify-content-center">
              {capabilities.includes(writeContents) && <><AppButtonLg
                title="Cancel"
                onClick={!state.isSaving ? () => router.push(`/admin/content-manager/${entity_type_slug}`) : null}
                className="general-button-cancel"
              />
              <AppButtonLg
                title="Draft"
                icon={state.isDrafting ? <AppButtonSpinner /> : <FaPencilRuler className="general-button-icon"/>}
                onClick={!state.isDrafting ? onDraftSubmit : null}
                className="general-button-draft"
              />
              <AppButtonLg
                title={state.isSaving ? "Saving" : "Save"}
                icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon"/>}
                onClick={!state.isSaving ? onPublishSubmit : null}
                className="general-button-save"
              /></>}
            </div>}
            <div className="py-3"> </div>
          </div> 
          <AppInfoModal
            show={state.show}
            onClose={() => (
              dispatch({ type: SET_SHOW, payload: false }),
              router.push(`/admin/content-manager/${entity_type_slug}`)
            )}
            modalTitle="Success"
            buttonTitle="Close"
          >
            {" "}
            {state.modalContent}{" "}
          </AppInfoModal>
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
