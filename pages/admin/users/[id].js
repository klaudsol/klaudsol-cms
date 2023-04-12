import CacheContext from "@/components/contexts/CacheContext";

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks";

import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

import { FaCheck, FaTrash, FaArrowRight } from "react-icons/fa";
import { Formik, Form } from "formik";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { DEFAULT_SKELETON_ROW_COUNT, writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";

import {
    LOADING,
    SAVING,
    DELETING,
    SET_MODAL_CONTENT,
    SET_VALUES,
} from "@/lib/actions";

import useUserReducer from "@/components/reducers/userReducer";

export default function Type({ cache }) {
    const [state, setState] = useUserReducer();

    const router = useRouter();

    const errorHandler = useClientErrorHandler();
    const { token = null, capabilities = [] } = cache;

    const { entity_type_slug, id } = router.query;
    const formRef = useRef();

    useEffect(() => {
        (async () => {
            try {
                setState(LOADING, true);
                const url = `/api/admin/users/${id}`;
                const params = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }

                const resRaw = await slsFetch(url, params);
                const { data } = await resRaw.json();

                setState(SET_VALUES, data[0]);
            } catch (ex) {
                errorHandler(ex);
            } finally {
                setState(LOADING, false);
            }
        })();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        formRef.current.handleSubmit();
    };

    const onDelete = async () => {
        try {
            setState(DELETING, true);

            const url = `/api/admin/users/${id}`
            const params = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            await slsFetch(url, params);

            setState(SET_MODAL_CONTENT, { title: "Success", text: "You have successfully deleted a user." });
        } catch (err) {
            errorHandler(err);
            setState(SET_MODAL_CONTENT, { title: "Error", text: err.message });
        } finally {
            setState(DELETING, false);
        }
    }

    const formikParams = {
        innerRef: formRef,
        initialValues: state.user,
        onSubmit: (values) => {
            (async () => {
                try {
                    setState(SAVING, true);

                    const isSameEmail = values.email === state.user.email;

                    const url = `/api/admin/users/${id}`
                    const params = {
                        method: 'PUT',
                        body: JSON.stringify({ ...values, isSameEmail }),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }

                    await slsFetch(url, params);

                    setState(SET_MODAL_CONTENT, { title: "Success", text: "You have successfully updated a user." });
                } catch (err) {
                    errorHandler(err);
                    setState(SET_MODAL_CONTENT, { title: "Error", text: err.message });
                } finally {
                    setState(SAVING, false);
                }
            })();
        },
    };

    const onModalClose = () => {
        setState(SET_MODAL_CONTENT, {});

        if (state.modalContent.title !== 'Success') return;

        router.push('/admin/users');
    }

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
                        {!state.isLoading &&
                            <div className="d-flex flex-row justify-content-center">
                                {capabilities.includes(writeUsers) && <><AppButtonLg
                                    title="Delete"
                                    icon={state.isDeleting ? <AppButtonSpinner /> : <FaTrash className="general-button-icon" />}
                                    onClick={onDelete}
                                    className="general-button-delete"
                                    isDisabled={state.isDeleting || state.isSaving}
                                />
                                    <AppButtonLg
                                        title={state.isSaving ? "Saving" : "Save"}
                                        icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon" />}
                                        onClick={onSubmit}
                                        isDisabled={state.isSaving || state.isSaving}
                                        className="general-button-save"
                                    /></>}
                            </div>}
                        <div className="py-3"> </div>
                    </div>
                    <AppInfoModal
                        show={state.modalContent.title}
                        onClose={onModalClose}
                        modalTitle={state.modalContent.title}
                        buttonTitle="Close"
                    >
                        {state.modalContent.text}
                    </AppInfoModal>
                </ContentManagerLayout>
            </div>
        </CacheContext.Provider>
    );
}
export const getServerSideProps = getSessionCache();
