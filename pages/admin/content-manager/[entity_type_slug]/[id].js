import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from "@/components/elements/inner/ContentManagerSubMenu";
import { getSessionCache } from "@/lib/Session";

import { useRouter } from "next/router";
import { useEffect, useReducer, useCallback, useRef } from "react";
import { slsFetch, sortByOrderAsc } from "@/components/Util";

/** kladusol CMS components */
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

/** react-icons */
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";
import { Col } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { DEFAULT_SKELETON_ROW_COUNT } from "lib/Constants";

import AdminRenderer from "@/components/renderers/admin/AdminRenderer";

import {
  initialState,
  actions,
  entityReducer,
} from "@/components/reducers/entityReducer";

export default function Type({ cache }) {
  const router = useRouter();

  const { entity_type_slug, id } = router.query;

  const [state, dispatch] = useReducer(entityReducer, initialState);
  const formRef = useRef();

  const onTextInputChange = (
    entries,
    col,
    value,
    attribute,
    attribute_type
  ) => {
    entries[col] = value;
    entries[attribute] = attribute_type;
    dispatch({ type: actions.SET_VALUES, payload: entries });
  };

  /*** Entity Types List ***/
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: actions.LOADING });
        const valuesRaw = await slsFetch(`/api/${entity_type_slug}/${id}`);
        const values = await valuesRaw.json();

        const entries = values.data;
        const attributes = values.metadata.attributes;
        const entity_type_id = values.metadata.entity_type_id;

        dispatch({ type: actions.SET_ATTRIBUTES, payload: attributes });
        dispatch({ type: actions.SET_VALUES, payload: entries });
        dispatch({ type: actions.SET_ENTITY_TYPE_ID, payload: entity_type_id });
      } catch (ex) {
        console.error(ex.stack);
      } finally {
        dispatch({ type: actions.CLEANUP });
      }
    })();
  }, [entity_type_slug, id]);

  const onSubmit = (e) => {
    e.preventDefault();
    formRef.current.handleSubmit();
  };

  const onDelete = useCallback(
    (evt) => {
      evt.preventDefault();
      (async () => {
        try {
          dispatch({ type: actions.DELETING });
          const response = await slsFetch(`/api/${entity_type_slug}/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          });
          const { message, homepage } = await response.json();
          dispatch({
            type: actions.SET_MODAL_CONTENT,
            payload: "You have successfully deleted the entry.",
          });
          dispatch({ type: actions.SET_SHOW, payload: true });
        } catch (ex) {
          console.error(ex);
        } finally {
          dispatch({ type: actions.CLEANUP });
        }
      })();
    },
    [entity_type_slug, id]
  );

  const getFormikInitialVals = () => {
    const { slug, id, ...initialValues } = state.values;

    return initialValues;
  };

  const getAllFiles = (entry) => {
    const initialValue = {};
    const reducer = (acc, curr) => {
      if (!(entry[curr] instanceof File)) return acc;

      return { ...acc, [curr]: entry[curr] };
    };

    const entryKeys = Object.keys(entry);
    const allFiles = entryKeys.reduce(reducer, initialValue);

    return allFiles;
  };

  const getS3Keys = (files) => {
    const fileKeys = Object.keys(files);
    const s3Keys = fileKeys.map((file) => state.values[file].key);

    return s3Keys;
  };

  const convertToFormData = (entry) => {
    const formData = new FormData();
    const propertyNames = Object.keys(entry);

    propertyNames.forEach((property) => {
      if (entry[property]?.key) {
        formData.append(property, entry[property].key);
        return;
      }

      formData.append(property, entry[property]);
    });

    return formData;
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: getFormikInitialVals(),
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: actions.SAVING });

          const filesToUpload = getAllFiles(values);
          const s3Keys = getS3Keys(filesToUpload);
          const newVals = {
            ...values,
            toDeleteRaw: s3Keys,
          };

          const entry = {
            ...newVals,
            entity_type_id: state.entity_type_id,
            entity_id: id,
          };

          const formattedEntries = convertToFormData(entry);

          const response = await slsFetch(`/api/${entity_type_slug}/${id}`, {
            method: "PUT",
            body: formattedEntries,
          });

          const { message, homepage } = await response.json();
          dispatch({
            type: actions.SET_MODAL_CONTENT,
            payload: "You have successfully edited the entry.",
          });
          dispatch({ type: actions.SET_SHOW, payload: true });
        } catch (ex) {
          console.error(ex);
        } finally {
          dispatch({ type: actions.CLEANUP });
        }
      })();
    },
  };

  return (
    <CacheContext.Provider value={cache}>
      <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
        <ContentManagerLayout>
          <div className="py-4">
            <AppBackButton
              link={`/admin/content-manager/${entity_type_slug}`}
            />
            <div className="d-flex justify-content-between align-items-center mt-0 mx-3 px-0">
              <div>
                <h3> {entity_type_slug} </h3>
                <a
                  href={`/api/${entity_type_slug}/${id}`}
                  passHref
                  target="_blank"
                  rel="noreferrer"
                >
                  api/{entity_type_slug}/{id}
                </a>
                <p> API ID : {id} </p>
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
                          {Object.entries(state.attributes)
                            .sort(sortByOrderAsc)
                            .map(([attributeName, attribute]) => {
                              return (
                                <div key={attributeName}>
                                  <p className="mt-1">
                                    <b> {attributeName} </b>
                                  </p>
                                  <AdminRenderer
                                    errors={props.errors}
                                    touched={props.touched}
                                    type={attribute.type}
                                    name={attributeName}
                                  />
                                </div>
                              );
                            })}
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

                  <div className="d-flex align-items-center justify-content-between mt-4">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> Created </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> 2 days ago </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> By </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> Ardee Aram </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> 2 days ago </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> Ardee Aram </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <p style={{ fontSize: "12px" }}>
                      {" "}
                      <b> By </b>{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}> </p>
                  </div>
                </div>
                {/* <button className="new_entry_block_button mt-2">  <MdModeEditOutline  className='icon_block_button' /> Edit the model </button>
            <button className="new_entry_block_button mt-2">  <VscListSelection  className='icon_block_button' /> Configure the view </button> */}
                <button
                  className="new_entry_block_button_delete mt-2"
                  onClick={onDelete}
                >
                  {" "}
                  {state.isDeleting ? (
                    <>
                      <AppButtonSpinner /> Deleting...{" "}
                    </>
                  ) : (
                    <>
                      <FaTrash className="icon_block_button" /> Delete the entry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <AppInfoModal
            show={state.show}
            onClose={() => (
              dispatch({ type: actions.SET_SHOW, payload: false }),
              router.push(`/admin/content-manager/${entity_type_slug}`)
            )}
            modalTitle="Success"
            buttonTitle="Close"
          >
            {" "}
            {state.modalContent}{" "}
          </AppInfoModal>
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
