import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from "@/components/elements/inner/ContentManagerSubMenu";
import { getSessionCache } from "@/lib/Session";

import { useRouter } from "next/router";
import { useEffect, useReducer, useRef } from "react";
import { slsFetch, sortByOrderAsc } from "@/components/Util";
import { Formik, Form, Field } from "formik";

/** kladusol CMS components */
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

/** react-icons */
import { FaCheck, FaImage } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";

import { DEFAULT_SKELETON_ROW_COUNT } from "lib/Constants";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";

import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import TypesValidator from "@/components/renderers/validation/RegexValidator";

import {
  initialState,
  createEntriesReducer,
  LOADING,
  REFRESH,
  CLEANUP,
  SAVING,
  SET_ATTRIBUTES,
  SET_ENTRIES,
  SET_SHOW,
  SET_ENTITY_TYPE_ID,
  SET_VALIDATE_ALL,
  SET_ALL_INITIAL_VALUES,
} from "@/components/reducers/createReducer";

export default function CreateNewEntry({ cache }) {
  const router = useRouter();

  const { entity_type_slug } = router.query;

  const [state, dispatch] = useReducer(createEntriesReducer, initialState);
  const formRef = useRef();

  const metaDataHandler = (data, val) =>
    Object.entries(data).map(([attributeName]) => ({ [attributeName]: val }));

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
        console.error(ex.stack);
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

  const createSlug = (slug) => {
    return slug.replaceAll(" ", "-").toLowerCase();
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: { ...state.set_all_initial_values, slug: "" },
    onSubmit: (values) => {
      (async () => {
        const entry = {
          ...values,
          entity_type_id: state.entity_type_id,
        };
        console.log(entry);
        try {
          dispatch({ type: SAVING });
          const response = await slsFetch(`/api/${entity_type_slug}`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ entry }),
          });
          const { message, homepage } = await response.json();
          dispatch({ type: SET_SHOW, payload: true });
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
      <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
        <ContentManagerLayout>
          <div className="py-4">
            <AppBackButton
              link={`/admin/content-manager/${entity_type_slug}`}
            />
            <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
              <div>
                <h3> Create an Entry </h3>
                <p> API ID : {entity_type_slug} </p>
              </div>
              <AppButtonLg
                title={state.isSaving ? "Saving" : "Save"}
                icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck />}
                onClick={onSubmit}
              />
            </div>
            <div className="row mt-4">
              <div className="col-9">
                <div className="container_new_entry py-4 px-4">
                  {state.isLoading &&
                    Array.from({ length: DEFAULT_SKELETON_ROW_COUNT }, () => (
                      <div>
                        <div className="skeleton-label" />
                        <div className="skeleton-text" />
                        <div />
                      </div>
                    ))}

                  {!state.isLoading && (
                    <Formik {...formikParams}>
                      {(props) => (
                        <Form>
                          <p className="mt-1">
                            {" "}
                            <b> slug </b>
                          </p>
                          <Field
                            name="slug"
                            validate={(e) => TypesValidator(e, "text")}
                          >
                            {({ field, meta }) => (
                              <div>
                                <input
                                  type="text"
                                  {...field}
                                  className="input_text mb-2"
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
                                  <div style={{ color: "red" }}>
                                    {meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                          {Object.entries(state.attributes)
                            .sort(sortByOrderAsc)
                            .map(([attributeName, attribute]) => (
                              <div key={attributeName}>
                                <p className="mt-1">
                                  {" "}
                                  <b> {attributeName} </b>
                                </p>
                                <AdminRenderer
                                  errors={props.errors}
                                  touched={props.touched}
                                  type={attribute.type}
                                  name={attributeName}
                                />
                              </div>
                            ))}
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              </div>
              <div className="col-3 mx-0">
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
              </div>
            </div>
          </div>
          <AppInfoModal
            show={state.show}
            onClose={() =>
              router.push(`/admin/content-manager/${entity_type_slug}`)
            }
            modalTitle="Success"
            buttonTitle="Close"
          >
            {" "}
            You have successfully created a new entry.{" "}
          </AppInfoModal>
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
