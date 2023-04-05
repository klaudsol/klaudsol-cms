import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { Formik, Form } from "formik";
import { useRef, useReducer, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { sortByOrderAsc } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";

/** react-icons */
import { FaCheck, FaImage, FaTrash } from "react-icons/fa";
import UploadRenderer from "@/components/renderers/admin/UploadRenderer";
import {
  settingReducer,
  initialState,
} from "@/components/reducers/settingReducer";
import { SAVING, LOADING, DELETING, CLEANUP, SET_VALUES, SET_CHANGED, SET_ERROR } from "@/lib/actions";
import { defaultLogo } from "@/constants/index";
import { convertToFormData, getAllFiles } from "@/lib/s3FormController";
import { validImageTypes } from "@/lib/Constants";
import { readSettings, modifyLogo } from "@/lib/Constants";
import { useClientErrorHandler } from "@/components/hooks"

export default function Settings({ cache }) {
  const formRef = useRef();
  const errorHandler = useClientErrorHandler();
  const router = useRouter();
  const [state, dispatch] = useReducer(settingReducer, initialState);
  const isValueExists = Object.keys(state.values).length !== 0 
  const capabilities = cache?.capabilities;

  const setInitialValues = (data) => {
    const initialVal = Object.keys(data).length !== 0 
      ? { mainlogo: { name: data.key, link: data.link, key: data.value } }
      : {};
      return initialVal;
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await slsFetch("/api/settings/mainlogo");
        const { data } = await response.json();
        const newData = setInitialValues(data);

        dispatch({ type: SET_VALUES, payload: newData });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
        errorHandler(error)
      } finally {
        dispatch({ type: CLEANUP });
      }
    })();
  }, []);

  const onDelete = useCallback((setStaticLink) => {
    (async () => {
      try {
        dispatch({ type: DELETING, payload: true });
        const response = await slsFetch(`/api/settings/mainlogo`, {
          method: "DELETE", 
          headers: {
            "Content-type": "application/json",
          },
        });
        dispatch({ type: SET_VALUES, payload: {} });
        formRef.current.resetForm({ values: {} });
        setStaticLink('');
        dispatch({ type: SET_CHANGED, payload:false })
      } catch (ex) {
        errorHandler(ex);
      } finally {
        dispatch({ type: DELETING, payload: false });
      }
    })();
  }, []);

  const onSubmit = (evt) => {
    evt.preventDefault();
    formRef.current.handleSubmit();
  };

  const getS3Keys = (files) => {
    if(!files) return

    const fileKeys = Object.keys(files);
    const s3Keys = fileKeys.map((file) => state.values[file].key);
    
    return s3Keys;
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: state.values,
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: SAVING });
          const isFile = Object.entries(values)[0][1] instanceof File;
          const isCreateMode = !isValueExists && isFile;
       
          const filesToUpload = !isCreateMode && getAllFiles(values);
          const s3Keys = getS3Keys(filesToUpload);   
          const newValues = isCreateMode ? values : {...values, toDeleteRaw: s3Keys}

          const formattedEntries = convertToFormData(newValues);
              
          const response = await slsFetch(`/api/settings${isCreateMode ? '' : '/mainlogo'}`, {
            method: `${isCreateMode ? "POST" : "PUT"}`,
            body: formattedEntries,
          });
          const { data } = await response.json()

          const newData = setInitialValues(data);
          dispatch({ type: SET_VALUES, payload: newData });
          formRef.current.resetForm({ values: newData });
          dispatch({ type: SET_CHANGED, payload:false })
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
      <InnerSingleLayout>
        <div>
          <div className="row">
            {capabilities.includes(readSettings) ? <div className="col-12">
              <div className="row mt-5">
                <div className="col-12 col-md-10">
                  <h3>Settings</h3>
                </div>
                <div className="col-12 col-md-2 float-right">
                 {capabilities.includes(modifyLogo) && <AppButtonLg
                    title={state.isSaving ? "Saving" : "Save"}
                    icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck />}
                    onClick={onSubmit}
                    isDisabled={state.isLoading || state.isSaving || state.isDeleting || !state.isChanged}
                  />}
                </div>
              </div>
              {!state.isLoading && (
                <Formik {...formikParams}>
                  {() => (
                    <Form>
                      <UploadRenderer
                        accept={validImageTypes}
                        name="mainlogo"                     
                        buttonPlaceholder={
                          !isValueExists ? "Upload logo" : "Change logo"
                        }
                        showDeleteButton={isValueExists}
                        isDeleting={state.isDeleting}
                        isSaving={state.isSaving}
                        onDelete={onDelete}
                        isErrorDisabled={true}
                        offName={true}
                        resetOnNewData={true}
                        dispatch={dispatch}
                        disableAllButtons={!capabilities.includes(modifyLogo)}
                      
                      />
                    </Form>
                  )}
                </Formik>
              )}
              {!isValueExists && !state.isLoading && "Logo is not set"}
            </div> : <p className="errorMessage">{state.errorMessage}</p>}
          </div>
        </div>
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
