import React, { useReducer, useRef } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { useRouter } from "next/router";
import { extractFiles } from "@/lib/s3FormController";
import { FaCheck } from "react-icons/fa";
import { contentManagerReducer, initialState } from "@/components/reducers/contentManagerReducer";
import {
  SAVING,
  CLEANUP,
  SET_SHOW,
  SET_MODAL_CONTENT,
} from "@/lib/actions";
import { writeContents } from "lib/Constants"
import { Formik, Form, Field } from "formik";
import { sortByOrderAsc } from "@/components/Util";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import { RiQuestionLine } from "react-icons/ri";
import { slugTooltipText } from "@/constants";

import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import GeneralHoverTooltip from "@/components/elements/tooltips/GeneralHoverTooltip";
import classname from "classnames";
import TypesValidator from "@/components/renderers/validation/RegexValidator";

const SingleType = ({ 
  entries, 
  entity_type_slug, 
  attributes, 
  capabilities, 
  entity_type_id 
}) => {
  const formRef = useRef();
  const router = useRouter();

  const [state, dispatch] = useReducer(contentManagerReducer, initialState);
    
  const onSubmit = (e) => {
    e.preventDefault();
    formRef.current.handleSubmit();
    formRef.current.setTouched({ ...state.set_validate_all, slug: true });
  };
    
  const formatSlug = (slug) => (slug.toLowerCase().replace(/\s+/g, "-"));
    
  const formikParams = {
    innerRef: formRef,
    initialValues: entries,
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: SAVING });
          const { slug } = values;
          const { data, fileNames, files } = await extractFiles(values);
          // Checks if the entry is to be updated or not
          // If there are no entries yet, it will call a different API (similar to create entry)
          // Method is POST
          const isUpdate = Object.keys(entries).length > 0;
          let url = `/api/${entity_type_slug}`;
          let method = 'POST';
          let formattedSlug = formatSlug(slug);
          let entry = {
            ...data,
            fileNames,
            slug: formattedSlug,
            entity_type_id: entity_type_id,
          }
    
          // If there is already an existing entry, it will call a different API to update 
          // Method is PUT
          if (isUpdate) {
            url = `/api/${entity_type_slug}/${values.id}`;
            method = 'PUT';
            entry = {
              ...data,
              fileNames,
              entity_type_slug,
              entity_id: values.id,
            }
          }
            
          const response = await slsFetch(url, {
            method: method,
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(entry),
          });
    
          const { message, presignedUrls } = await response.json();
    
          if (files.length > 0) await uploadFilesToUrl(files, presignedUrls);
    
          dispatch({
            type: SET_MODAL_CONTENT,
            payload: message,
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
  return (
    <>
    {state.isLoading && (
      <Formik {...formikParams}>
        {(props) => (
        <Form>
          {Object.keys(entries).length === 0 && 
          <>
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
                    className={classname(
                      "general-input-text", 
                      {"general-input-error" : meta.touched && meta.error}
                    )}
                  />
                  {meta.touched && 
                   meta.error && (
                    <div className="general-input-error-text">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>
          </>}
          {Object.entries(attributes)
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
                   disabled={!capabilities.includes(writeContents)}
                  />
                </div>);
          })}
        </Form>
      )}
    </Formik>
    )}
    {state.isLoading && 
      <div className="d-flex flex-row justify-content-center">
      {capabilities.includes(writeContents) && 
      <>
        <AppButtonLg
          title="Cancel"
          onClick={!state.isSaving ? () => router.push(`/admin/content-manager/${entity_type_slug}`) : null}
          className="general-button-cancel mb-3"
        />
        <AppButtonLg
          title={state.isSaving ? "Saving" : "Save"}
          icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon"/>}
          onClick={!state.isSaving ? onSubmit : null}
          className="general-button-save mb-3"
        />
      </>}
      <AppInfoModal
            show={state.show}
            onClose={() => (
              dispatch({ type: SET_SHOW, payload: false }),
              router.reload()
            )}
            modalTitle="Success"
            buttonTitle="Close"
          >
            {" "}
            {state.modalContent}{" "}
          </AppInfoModal>
    </div>}
  </>
  )
}

export default SingleType;