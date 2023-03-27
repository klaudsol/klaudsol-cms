import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { Formik, Form, Field } from "formik";
import { useRef, useReducer, useEffect, useState, useCallback } from "react";

import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { slsFetch } from "@klaudsol/commons/lib/Client";

/** react-icons */
import { FaCheck } from "react-icons/fa";
import UploadRenderer from "@/components/renderers/admin/UploadRenderer";
import {
  settingReducer,
  initialState,
} from "@/components/reducers/settingReducer";
import { SAVING, CLEANUP, SET_VALUES, SET_ERROR } from "@/lib/actions";
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

  const getFilesToDelete = (values) => {
    const files = Object.keys(values).filter(
      (value) => values[value] instanceof File
    );
    const keys = files.map((file) => state.values[file].key);

    return keys;
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: state.values,
    enableReinitialize: true,
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: SAVING });
          const { files, data, fileNames } = await getBody(values);
          const toDelete = getFilesToDelete(values);

          const entry = {
            ...data,
            fileNames,
            toDelete,
          };

          const url = `/api/settings`;
          const params = {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(entry),
          };

          const response = await slsFetch(url, params);

          const { presignedUrls } = await response.json();

          if (files.length > 0) await uploadFilesToUrl(files, presignedUrls);
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
