import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { Formik, Form, Field } from "formik";
import { useRef, useReducer, useEffect, useState, useCallback } from "react";

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
import {
  SAVING,
  LOADING,
  DELETING,
  CLEANUP,
  SET_VALUES,
  SET_CHANGED,
  SET_ERROR,
} from "@/lib/actions";
import { defaultLogo } from "@/constants/index";
import { convertToFormData, getAllFiles } from "@/lib/s3FormController";
import { validImageTypes } from "@/lib/Constants";
import { readSettings, modifyLogo } from "@/lib/Constants";

export default function Settings({ cache }) {
  const formRef = useRef();
  const [state, dispatch] = useReducer(settingReducer, initialState);
  const isValueExists = Object.keys(state.values).length !== 0;
  const capabilities = cache?.capabilities;

  /* const setInitialValues = (data) => { */
  /*   const initialVal = Object.keys(data).length !== 0  */
  /*     ? { mainlogo: { name: data.key, link: data.link, key: data.value } } */
  /*     : {}; */
  /*     return initialVal; */
  /* }; */

  /* useEffect(() => { */
  /*   (async () => { */
  /*     try { */
  /*       const response = await slsFetch("/api/settings/mainlogo"); */
  /*       const { data } = await response.json(); */
  /*       const newData = setInitialValues(data); */
  /**/
  /*       dispatch({ type: SET_VALUES, payload: newData }); */
  /*     } catch (error) { */
  /*       dispatch({ type: SET_ERROR, payload: error.message }); */
  /*     } finally { */
  /*       dispatch({ type: CLEANUP }); */
  /*     } */
  /*   })(); */
  /* }, []); */

  /* const onDelete = useCallback((setStaticLink) => { */
  /*   (async () => { */
  /*     try { */
  /*       dispatch({ type: DELETING, payload: true }); */
  /*       const response = await slsFetch(`/api/settings/mainlogo`, { */
  /*         method: "DELETE", */
  /*         headers: { */
  /*           "Content-type": "application/json", */
  /*         }, */
  /*       }); */
  /*       dispatch({ type: SET_VALUES, payload: {} }); */
  /*       formRef.current.resetForm({ values: {} }); */
  /*       setStaticLink(''); */
  /*       dispatch({ type: SET_CHANGED, payload:false }) */
  /*     } catch (ex) { */
  /*       console.error(ex); */
  /*     } finally { */
  /*       dispatch({ type: DELETING, payload: false }); */
  /*     } */
  /*   })(); */
  /* }, []); */

  const onSubmit = (evt) => {
    evt.preventDefault();
    formRef.current.handleSubmit();
  };

  /* const getS3Keys = (files) => { */
  /*   if(!files) return */
  /**/
  /*   const fileKeys = Object.keys(files); */
  /*   const s3Keys = fileKeys.map((file) => state.values[file].key); */
  /*    */
  /*   return s3Keys; */
  /* }; */

  const formikParams = {
    innerRef: formRef,
    initialValues: state.values,
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: SAVING });
          console.log(values);
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
              <div className="mt-5 d-flex justify-content-between">
                <h3>Settings</h3>
                <AppButtonLg
                  title={state.isSaving ? "Saving" : "Save"}
                  icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck />}
                  onClick={onSubmit}
                />
              </div>
              <Formik {...formikParams}>
                <Form>
                  <div>
                    Default view
                    <Field as="select" name="defaultView">
                      <option value="grid">grid</option>
                      <option value="list">list</option>
                    </Field>
                  </div>
                  <div>
                    CMS Name
                    <Field name="name" />
                  </div>
                  <div>
                    Logo
                    <UploadRenderer name="logo" isErrorDisabled />
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
