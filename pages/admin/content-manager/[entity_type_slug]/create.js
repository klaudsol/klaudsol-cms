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

export default function CreateNewEntry({ cache }) {
  const router = useRouter();

  const { entity_type_slug } = router.query;

  const initialState = {
    attributes: {},
    isLoading: false,
    isRefresh: true,
    isSaving: false,
    show: false,
    entity_type_id: null,
  };

  const LOADING = "LOADING";
  const REFRESH = "REFRESH";
  const CLEANUP = "CLEANUP";
  const SAVING = "SAVING";

  const SET_ATTRIBUTES = "SET_ATTRIBUTES";
  const SET_ENTRIES = "SET_ENTRIES";
  const SET_SHOW = "SET_SHOW";
  const SET_ENTITY_TYPE_ID = "SET_ENTITY_TYPE_ID";

  //refactor to global reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case LOADING:
        return {
          ...state,
          isLoading: true,
        };

      case SAVING:
        return {
          ...state,
          isSaving: true,
          isLoading: true,
        };

      case REFRESH:
        return {
          ...state,
          isRefresh: false,
        };

      case CLEANUP:
        return {
          ...state,
          isLoading: false,
          isSaving: false,
        };

      case SET_ATTRIBUTES:
        return {
          ...state,
          attributes: action.payload,
        };

      case SET_ENTRIES:
        return {
          ...state,
          entries: action.payload,
        };

      case SET_SHOW:
        return {
          ...state,
          show: action.payload,
        };

      case SET_ENTITY_TYPE_ID:
        return {
          ...state,
          entity_type_id: action.payload,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const formRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: LOADING });
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}`);
        const values = await valuesRaw.json();

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
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const createSlug = (slug) => {
    return slug.replaceAll(" ", "-").toLowerCase();
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: {},
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
                    Array.from(
                      { length: DEFAULT_SKELETON_ROW_COUNT },
                      (e, i) => (
                        <div key={i}>
                          <div className="skeleton-label" />
                          <div className="skeleton-text" />
                          <div />
                        </div>
                      )
                    )}

                  {!state.isLoading && (
                    <Formik {...formikParams}>
                      <Form>
                        <p className="mt-1">
                          <b> slug </b>
                        </p>
                        <Field
                          type="text"
                          className="input_text mb-2"
                          name="slug"
                        />
                        {Object.entries(state.attributes)
                          .sort(sortByOrderAsc)
                          .map(([attributeName, attribute]) => (
                            <div key={attributeName}>
                              <p className="mt-1">
                                <b> {attributeName} </b>
                              </p>
                              <AdminRenderer
                                type={attribute.type}
                                name={attributeName}
                              />
                            </div>
                          ))}
                      </Form>
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
                      <b> Created </b>
                    </p>
                    <p style={{ fontSize: "12px" }}> now </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      <b> By </b>
                    </p>
                    <p style={{ fontSize: "12px" }}> </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      <b> Last update </b>
                    </p>
                    <p style={{ fontSize: "12px" }}> now </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      <b> By </b>
                    </p>
                    <p style={{ fontSize: "12px" }}> </p>
                  </div>
                </div>
                <button className="new_entry_block_button mt-2">
                  <MdModeEditOutline className="icon_block_button" />
                  Edit the model
                </button>
                <button className="new_entry_block_button mt-2">
                  <VscListSelection className="icon_block_button" />
                  Configure the view
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
            You have successfully created a new entry.
          </AppInfoModal>
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
