import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from "@/components/elements/inner/ContentManagerSubMenu";

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks";

import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useReducer, useCallback, useRef } from "react";
import { sortByOrderAsc } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";

/** kladusol CMS components */
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

/** react-icons */
import { FaCheck, FaTrash, FaArrowRight } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";
import { Col } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { DEFAULT_SKELETON_ROW_COUNT, writeUsers } from "lib/Constants";
import { getAllFiles, getNonFiles, getBody } from "@/lib/s3FormController";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { redirectToManagerEntitySlug } from "@/components/klaudsolcms/routers/routersRedirect";

import {
    initialState,
    entityReducer,
} from "@/components/reducers/entityReducer";

import {
    LOADING,
    REFRESH,
    SAVING,
    DELETING,
    CLEANUP,
    SET_SHOW,
    SET_MODAL_CONTENT,
    SET_VALUES,
    SET_ATTRIBUTES,
    SET_COLUMNS,
    SET_ENTITY_TYPE_NAME,
    SET_ENTITY_TYPE_ID,
    SET_ALL_VALIDATES
} from "@/lib/actions";

export default function Type({ cache }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const errorHandler = useClientErrorHandler();
    const { token = null, capabilities = [] } = cache;

    const { entity_type_slug, id } = router.query;
    const formRef = useRef();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const url = `/api/admin/users/${id}`;
                const params = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }

                const resRaw = await slsFetch(url, params);
                const { data } = await resRaw.json();

                setUser(data[0]);
            } catch (ex) {
                errorHandler(ex);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        formRef.current.handleSubmit();
        state.allValidates && formRef.current.setTouched({ ...state.allValidates });
    };

    const onDelete = () => { }

    const formikParams = {
        innerRef: formRef,
        initialValues: user,
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
                        entity_type_slug,
                        entity_id: id,
                    };

                    const response = await slsFetch(`/api/${entity_type_slug}/${id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(entry),
                    });

                    const { message, presignedUrls } = await response.json();

                    if (files.length > 0) await uploadFilesToUrl(files, presignedUrls);

                    dispatch({
                        type: SET_MODAL_CONTENT,
                        payload: "You have successfully edited the entry.",
                    });
                    dispatch({ type: SET_SHOW, payload: true });
                } catch (ex) {
                    errorHandler(ex);
                } finally {
                    dispatch({ type: CLEANUP });
                }
            })();
        },
    };

    console.log(user)

    return (
        <CacheContext.Provider value={cache}>
            <div className="wrapper d-flex align-items-start justify-content-start min-vh-100 bg-light">
                <ContentManagerLayout currentTypeSlug={entity_type_slug}>
                    <div className="py-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <AppBackButton link={`/admin/users/`} />
                            <Link href={`/admin/users/${id}/change-password`}> {/* I just copied AppBackButton */}
                                <button className="btn_back">
                                    <FaArrowRight className='icon_general' />
                                    Change Password
                                </button>
                            </Link>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
                            <div>
                                <div className="general-header"> Edit user </div>
                            </div>
                        </div>
                        <div className="row mt-4 mx-0 px-0">
                            <div className="col-12 mx-0 px-0 mb-2">
                                <div className="py-0 px-0 mb-3">
                                    {isLoading &&
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
                                    {!isLoading && (
                                        <Formik {...formikParams}>
                                            {(props) => (
                                                <Form>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="col">
                                                            <p className="general-input-title"> First Name </p>
                                                            <AdminRenderer
                                                                errors={props.errors}
                                                                touched={props.touched}
                                                                type="text"
                                                                name='firstName'
                                                                disabled={!capabilities.includes(writeUsers)}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <p className="general-input-title"> Last Name </p>
                                                            <AdminRenderer
                                                                errors={props.errors}
                                                                touched={props.touched}
                                                                type="text"
                                                                name='lastName'
                                                                disabled={!capabilities.includes(writeUsers)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="general-input-title"> Email </p>
                                                        <AdminRenderer
                                                            errors={props.errors}
                                                            touched={props.touched}
                                                            type="text"
                                                            name='email'
                                                            disabled={!capabilities.includes(writeUsers)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <AdminRenderer
                                                            title="Force password change"
                                                            errors={props.errors}
                                                            touched={props.touched}
                                                            type="checkbox"
                                                            name='forcePasswordChange'
                                                            disabled={!capabilities.includes(writeUsers)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <AdminRenderer
                                                            title="Login enabled"
                                                            errors={props.errors}
                                                            touched={props.touched}
                                                            type="checkbox"
                                                            name='loginEnabled'
                                                            disabled={!capabilities.includes(writeUsers)}
                                                        />
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!isLoading &&
                            <div className="d-flex flex-row justify-content-center">
                                {capabilities.includes(writeUsers) && <><AppButtonLg
                                    title="Cancel"
                                    // onClick={!state.isSaving ? () => router.push(`/admin/content-manager/${entity_type_slug}`) : null}
                                    className="general-button-cancel"
                                />
                                    <AppButtonLg
                                        // title={state.isSaving ? "Saving" : "Save"}
                                        // icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon"/>}
                                        // onClick={!state.isSaving ? onSubmit : null}
                                        className="general-button-save"
                                    /></>}
                            </div>}
                        <div className="py-3"> </div>
                    </div>
                    {/* <AppInfoModal */}
                    {/*   show={state.show} */}
                    {/*   onClose={() => ( */}
                    {/*     dispatch({ type: SET_SHOW, payload: false }), */}
                    {/*     router.push(`/admin/content-manager/${entity_type_slug}`) */}
                    {/*   )} */}
                    {/*   modalTitle="Success" */}
                    {/*   buttonTitle="Close" */}
                    {/* > */}
                    {/*   {" "} */}
                    {/*   {state.modalContent}{" "} */}
                    {/* </AppInfoModal> */}
                </ContentManagerLayout>
            </div>
        </CacheContext.Provider>
    );
}
export const getServerSideProps = getSessionCache();
