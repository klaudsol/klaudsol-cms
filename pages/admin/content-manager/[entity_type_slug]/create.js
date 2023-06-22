import CacheContext from "@/components/contexts/CacheContext";
import EntityContext from "@/components/contexts/EntityContext";

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks";

import { useRouter } from "next/router";
import { useEffect, useReducer, useRef } from "react";
import { sortByOrderAsc } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { Formik, Form, Field } from "formik";
import { slugTooltipText } from "constants";
import {
  initialState,
  createEntriesReducer,
} from "@/components/reducers/createReducer";
import {
  LOADING,
  CLEANUP,
  SAVING,
  DRAFTING,
  SET_ATTRIBUTES,
  SET_SHOW,
  SET_ENTITY_TYPE_ID,
  SET_VALIDATE_ALL,
  SET_ALL_INITIAL_VALUES,
} from "@/lib/actions";
import { FaCheck, FaPencilRuler } from "react-icons/fa";
import { DEFAULT_SKELETON_ROW_COUNT, writeContents } from "lib/Constants";
import { getAllFiles, getNonFiles, extractFiles } from "@/lib/s3FormController";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import { redirectToManagerEntitySlug } from "@/components/klaudsolcms/routers/routersRedirect";
import classname from "classnames";
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import GeneralHoverTooltip from "components/elements/tooltips/GeneralHoverTooltip";
import { RiQuestionLine } from "react-icons/ri";
import EntityType from "@/backend/models/core/EntityType";
import Entity from "@/backend/models/core/Entity";
import RecordNotFound from '@klaudsol/commons/errors/RecordNotFound';

export default function CreateNewEntry({ cache, entity }) {
  const router = useRouter();
  const errorHandler = useClientErrorHandler();
  const capabilities = cache?.capabilities;

  const { entity_type_slug } = router.query;

  const [state, dispatch] = useReducer(createEntriesReducer, initialState);
  const formRef = useRef();
  const statusRef = useRef("");

  const metaDataHandler = (data, val) => {
    return Object.entries(data).map(([attributeName, attributeValue]) => {
      if (attributeValue.type === "boolean") {
        return { [attributeName]: false };
      } else {
        return { [attributeName]: val };
      }
    });
  };

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: LOADING });
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}`);
        const values = await valuesRaw.json();

        const validateValues = metaDataHandler(
          values.metadata.attributes,
          true
        );

        const initialValues = metaDataHandler(values.metadata.attributes, "");

        dispatch({
          type: SET_ALL_INITIAL_VALUES,
          payload: Object.assign({}, ...initialValues),
        });
        dispatch({
          type: SET_VALIDATE_ALL,
          payload: Object.assign({}, ...validateValues),
        });
        dispatch({ type: SET_ATTRIBUTES, payload: values.metadata.attributes });
        dispatch({
          type: SET_ENTITY_TYPE_ID,
          payload: values.metadata.entity_type_id,
        });
      } catch (ex) {
        errorHandler(ex);
      } finally {
        dispatch({ type: CLEANUP });
      }
    })();
  }, [entity_type_slug]);

  const onSubmit = (evt) => {
    evt.preventDefault();
    formRef.current.handleSubmit();
    state.set_validate_all &&
      formRef.current.setTouched({ ...state.set_validate_all, slug: true });
  };

  const onPublishSubmit = (e) => {
    statusRef.current = "published";

    dispatch({ type: SAVING });

    onSubmit(e);
  }

  const onDraftSubmit = (e) => {
    statusRef.current = "draft";

    dispatch({ type: DRAFTING });

    onSubmit(e);
  }

  const formatSlug = (slug) => {
    return slug.toLowerCase().replace(/\s+/g, "-");
  };

  const convertToFormData = (entry) => {
    const formData = new FormData();
    const propertyNames = Object.keys(entry);
    propertyNames.forEach((property) => {
      formData.append(property, entry[property]);
    });

    return formData;
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: { ...state.set_all_initial_values, slug: "" },
    onSubmit: (values) => {
      (async () => {
        const { slug } = values;
        const formattedSlug = formatSlug(slug);
        const { data, fileNames, files } = await extractFiles(values);

        const entry = {
          ...data,
          fileNames,
          slug: formattedSlug,
          entity_type_id: state.entity_type_id,
          status: statusRef.current
        };

        try {

          const response = await slsFetch(`/api/${entity_type_slug}/${entity.id}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry),
          });
          const { message, presignedUrls } = await response.json();

          if (files.length > 0) await uploadFilesToUrl(files, presignedUrls);

          dispatch({ type: SET_SHOW, payload: true });
        } catch (ex) {
          errorHandler(ex);
        } finally {
          dispatch({ type: CLEANUP });
        }
      })();
    },
  };

  return (
    <CacheContext.Provider value={cache}>
      <EntityContext.Provider value={entity}>
        <div className="d-flex flex-row mt-2 pt-0 mx-0 px-0">
         <ContentManagerLayout currentTypeSlug={entity_type_slug}>
            {capabilities.includes(writeContents) ? <div className="py-4">
              <div className="d-flex justify-content-between align-items-center mt-2 mx-0 px-0">
                <div>
                  <div className="general-header"> Create an Entry </div>
                  <p> API ID : {entity_type_slug} </p>
                </div>
              </div>
              <div className="row mt-4 mx-0 px-0">
                <div className="col-12 mx-0 px-0">
                  <div className=" py-0 px-0 mx-0">
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
                            <p className="general-input-title-slug"> Slug </p> 
                            <GeneralHoverTooltip 
                              icon={<RiQuestionLine className="general-input-title-slug-icon"/>}
                              className="general-table-header-slug"
                              tooltipText={slugTooltipText}
                              position="left"
                            /> 
                            </div>
                            <Field
                              name="slug"
                              validate={(e) => TypesValidator(e, "text")}
                            >
                              {({ field, meta }) => (
                                <div>
                                  <input
                                    type="text"
                                    {...field}
                                    className={classname("general-input-text", {"general-input-error" : meta.touched && meta.error})}
                                    style={
                                      meta.touched && meta.error
                                        ? {
                                            borderColor: "red",
                                            outlineColor: "red",
                                          }
                                        : {}
                                    }
                                  />
                                  {meta.touched && meta.error && (
                                    <div className="general-input-error-text">
                                      {meta.error}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Field>
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
                                    />
                                  </div>
                                );
                              })}
                          </Form>
                        )}
                      </Formik>
                    )}
                  </div>
                  {!state.isLoading &&
                  <div className="d-flex flex-row justify-content-center my-4">
                    <AppButtonLg
                      title="Cancel"
                      onClick={!state.isSaving ? () => router.push(`/admin/content-manager/${entity_type_slug}`) : null}
                      className="general-button-cancel"
                    />
                    <AppButtonLg
                      title="Draft"
                      icon={state.isDrafting ? <AppButtonSpinner /> : <FaPencilRuler className="general-button-icon"/>}
                      onClick={!state.isSaving ? onDraftSubmit : null}
                      className="general-button-draft"
                    />
                    <AppButtonLg
                      title={state.isSaving ? "Saving" : "Save"}
                      icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon"/>}
                      onClick={!state.isSaving ? onPublishSubmit : null}
                      className="general-button-save"
                    />
                  </div>}
                </div>
                {/* <div className="col-3 mx-0">
                  <div className="container_new_entry px-3 py-4">
                    <p style={{ fontSize: "11px" }}> INFORMATION </p>
                    <div className="block_bar"></div>

                    <div className="d-flex align-items-center justify-content-between my-2">
                      <p style={{ fontSize: "12px" }}>
                        {" "}
                        <b> Created </b>{" "}
                      </p>
                      <p style={{ fontSize: "12px" }}> now </p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <p style={{ fontSize: "12px" }}>
                        {" "}
                        <b> By </b>{" "}
                      </p>
                      <p style={{ fontSize: "12px" }}> </p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <p style={{ fontSize: "12px" }}>
                        {" "}
                        <b> Last update </b>{" "}
                      </p>
                      <p style={{ fontSize: "12px" }}> now </p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <p style={{ fontSize: "12px" }}>
                        {" "}
                        <b> By </b>{" "}
                      </p>
                      <p style={{ fontSize: "12px" }}> </p>
                    </div>
                  </div>
                  <button className="new_entry_block_button mt-2">
                    {" "}
                    <MdModeEditOutline className="icon_block_button" /> Edit the
                    model{" "}
                  </button>
                  <button className="new_entry_block_button mt-2">
                    {" "}
                    <VscListSelection className="icon_block_button" /> Configure
                    the view{" "}
                  </button>
                </div> */}
              </div>
            </div> : <p className="errorMessage">forbidden.</p>}
            <AppInfoModal
              show={state.show}
              onClose={() =>
                redirectToManagerEntitySlug(router, entity_type_slug)
              }
              modalTitle="Success"
              buttonTitle="Close"
            >
              {" "}
              You have successfully created a new entry.{" "}
            </AppInfoModal>
          </ContentManagerLayout>
        </div>
      </EntityContext.Provider>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache(async (context) => {
    const { entity_type_slug } = context.query;

    const entityType = await EntityType.find({ slug: entity_type_slug });
    const { entity_type_id } = entityType[0];

    const draft = await Entity.createDraft({ entity_type_id });

    return { 
        props: { 
            entity: draft 
        }
    }
});
