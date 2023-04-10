import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef } from "react";
import { sortByOrderAsc } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { Formik, Form, Field } from "formik";
import { slugTooltipText } from "constants";
import {
  initialState,
  createEntriesReducer,
} from "@/components/reducers/createReducer";
import {
  LOADING,
  CLEANUP,
  SAVING,
  SET_ATTRIBUTES,
  SET_SHOW,
  SET_ENTITY_TYPE_ID,
  SET_VALIDATE_ALL,
  SET_ALL_INITIAL_VALUES,
} from "@/lib/actions";
import { FaCheck } from "react-icons/fa";
import { DEFAULT_SKELETON_ROW_COUNT, writeContents } from "lib/Constants";
import { getAllFiles, getNonFiles, getBody } from "@/lib/s3FormController";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import { redirectToManagerEntitySlug } from "@/components/klaudsolcms/routers/routersRedirect";
import classname from "classnames";
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import GeneralHoverTooltip from "components/elements/tooltips/GeneralHoverTooltip";
import { RiQuestionLine } from "react-icons/ri";

export default function CreateUsersPage({ cache }) {
  const router = useRouter();

  const [state, dispatch] = useReducer(createEntriesReducer, initialState);
  const formRef = useRef();

  useEffect(() => {}, []);

  const onSubmit = (evt) => {
    evt.preventDefault();
    formRef.current.handleSubmit();
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: { ...state.set_all_initial_values, slug: "" },
    onSubmit: (values) => {
      (async () => {
        try {
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
      <div className="d-flex flex-row mt-2 pt-0 mx-0 px-0">
        <ContentManagerLayout>
          <div className="py-4">
            <div className="d-flex justify-content-between align-items-center mt-2 mx-0 px-0">
              <div>
                <div className="general-header"> Create an Entry </div>
                <p> API ID : {entity_type_slug} </p>
              </div>
            </div>
            <div className="row mt-4 mx-0 px-0">
              <div className="col-12 mx-0 px-0">
                <div className=" py-0 px-0 mx-0">
                  {state.isLoading &&
                    Array.from(
                      { length: DEFAULT_SKELETON_ROW_COUNT },
                      (_, i) => (
                        <div key={i}>
                          <div className="skeleton-label" />
                          <div className="skeleton-text" />
                          <div />
                        </div>
                      )
                    )}
                  {!state.isLoading && (
                    <Formik {...formikParams}>
                      {(props) => (
                        <Form>
                          <Field
                            name="slug"
                            validate={(e) => TypesValidator(e, "text")}
                          >
                            {({ field, meta }) => (
                              <div>
                                <input
                                  type="text"
                                  {...field}
                                  className={classname("general-input-text", {
                                    "general-input-error":
                                      meta.touched && meta.error,
                                  })}
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
                                  <div className="general-input-error-text">
                                    {meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                          {Object.entries(state.attributes)
                            .sort(sortByOrderAsc)
                            .map(([attributeName, attribute]) => {
                              return (
                                <div key={attributeName}>
                                  <p className="general-input-title">
                                    {" "}
                                    {attributeName.replaceAll("_", " ")}{" "}
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
                {!state.isLoading && (
                  <div className="d-flex flex-row justify-content-center my-4">
                    <AppButtonLg
                      title="Cancel"
                      onClick={
                        !state.isSaving
                          ? () =>
                              router.push(
                                `/admin/content-manager/${entity_type_slug}`
                              )
                          : null
                      }
                      className="general-button-cancel"
                    />
                    <AppButtonLg
                      title={state.isSaving ? "Saving" : "Save"}
                      icon={
                        state.isSaving ? (
                          <AppButtonSpinner />
                        ) : (
                          <FaCheck className="general-button-icon" />
                        )
                      }
                      onClick={!state.isSaving ? onSubmit : null}
                      className="general-button-save"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <AppInfoModal
            show={state.show}
            onClose={() =>
              redirectToManagerEntitySlug(router, entity_type_slug)
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
