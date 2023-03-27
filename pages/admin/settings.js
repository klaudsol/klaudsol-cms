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

  useEffect(() => {
    (async () => {
      try {
        const response = await slsFetch("/api/settings/");
        const { data: dataRaw } = await response.json();

        const data = dataRaw.reduce((acc, curr) => {
          return { ...acc, [curr.setting]: curr.value };
        }, {});

        dispatch({ type: SET_VALUES, payload: data });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: CLEANUP });
      }
    })();
  }, []);

  const onSubmit = (evt) => {
    evt.preventDefault();
    formRef.current.handleSubmit();
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: state.values,
    enableReinitialize: true,
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
                    <Field as="select" name="default_view">
                      <option value="grid">grid</option>
                      <option value="list">list</option>
                    </Field>
                  </div>
                  <div>
                    CMS Name
                    <Field name="cms_name" />
                  </div>
                  <div>
                    Logo
                    <UploadRenderer name="main_logo" isErrorDisabled />
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
