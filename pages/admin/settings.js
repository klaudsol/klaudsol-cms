import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import RootContext from "@/components/contexts/RootContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { Formik, Form, Field } from "formik";
import {
  useRef,
  useReducer,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

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
import { getFilesToDelete, getBody } from "@/lib/s3FormController";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import { validImageTypes } from "@/lib/Constants";
import { readSettings, modifyLogo } from "@/lib/Constants";

export default function Settings({ cache }) {
  const formRef = useRef();
  const [state, dispatch] = useReducer(settingReducer, initialState);
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const isValueExists = Object.keys(state.values).length !== 0;
  const capabilities = cache?.capabilities;

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
    initialValues: rootState.settings,
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
                  <div className="d-flex gap-3 mb-2 w-50">
                    <div className="flex-grow-1">
                      <p className="general-input-title-slug mb-2">CMS Name</p>
                      <Field className="general-input-text" name="cms_name" />
                    </div>
                    <div className="flex-grow-1">
                      <p className="general-input-title-slug mb-2">
                        Default view
                      </p>
                      <Field
                        as="select"
                        className="general-input-text"
                        name="default_view"
                      >
                        <option value="icon">icon</option>
                        <option value="list">list</option>
                      </Field>
                    </div>
                  </div>
                  <div>
                    <p className="general-input-title-slug mb-2">Logo</p>
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
