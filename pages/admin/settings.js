import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import { Formik, Form } from "formik";
import { useRef, useReducer, useEffect, useState, useCallback } from "react";

import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { slsFetch, sortByOrderAsc } from "@/components/Util";

/** react-icons */
import { FaCheck, FaImage, FaTrash } from "react-icons/fa";
import UploadRenderer from "@/components/renderers/admin/UploadRenderer";
import {
  settingReducer,
  initialState,
} from "@/components/reducers/settingReducer";
import { SAVING, LOADING, DELETING, CLEANUP, SET_VALUES } from "@/lib/actions";
import { defaultLogo } from "@/constants/index";
import { convertToFormData, getAllFiles } from "@/lib/s3FormController";
import { validImageTypes } from "@/lib/Constants";


export default function Settings({ cache }) {
  const formRef = useRef();
  const [state, dispatch] = useReducer(settingReducer, initialState);
  const isValueExists = Object.keys(state.values).length !== 0 

  const setInitialValues = (data) => {
    const initialVal = Object.keys(data).length !== 0 
      ? { mainlogo: { name: data.key, link: data.link, key: data.value } }
      : {};
      return initialVal;
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await slsFetch("/api/resources/mainlogo");
        const { data } = await response.json();
        const newData = setInitialValues(data);

        dispatch({ type: SET_VALUES, payload: newData });
      } catch (err) {
      } finally {
        dispatch({ type: CLEANUP });
      }
    })();
  }, []);

  const onDelete = useCallback((setStaticLink) => {
    (async () => {
      try {
        dispatch({ type: DELETING, payload: true });
        const response = await slsFetch(`/api/resources/mainlogo`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        });
        dispatch({ type: SET_VALUES, payload: {} });
        formRef.current.resetForm({ values: {} });
        setStaticLink('');
      } catch (ex) {
        console.error(ex);
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
              
          const response = await slsFetch(`/api/resources${isCreateMode ? '' : '/mainlogo'}`, {
            method: `${isCreateMode ? "POST" : "PUT"}`,
            body: formattedEntries,
          });
          const { data } = await response.json()

          const newData = setInitialValues(data);
          dispatch({ type: SET_VALUES, payload: newData });
          formRef.current.resetForm({ values: newData });
        } catch (ex) {
          console.error(ex);
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
            <div className="col-12">
              <div className="row mt-5">
                <div className="col-12 col-md-10">
                  <h3>Settings</h3>
                </div>
                <div className="col-12 col-md-2 float-right">
                  <AppButtonLg
                    title={state.isSaving ? "Saving" : "Save"}
                    icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck />}
                    onClick={onSubmit}
                    isDisabled={state.isLoading || state.isSaving || state.isDeleting}
                  />
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
                        
                      />
                    </Form>
                  )}
                </Formik>
              )}
              {!isValueExists && !state.isLoading && "Logo is not set"}
            </div>
          </div>
        </div>
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
