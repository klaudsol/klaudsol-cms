import CacheContext from "@/components/contexts/CacheContext";

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks";

import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

import { FaCheck, FaArrowRight } from "react-icons/fa";
import { Formik, Form } from "formik";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { AUTO_PASSWORD, writeUsers } from "@/lib/Constants";

import {
    LOADING,
    SAVING,
    DELETING,
    SET_MODAL_CONTENT,
    SET_VALUES,
} from "@/lib/actions";

import useUserReducer from "@/components/reducers/userReducer";
import CreateUserForm from "@/components/forms/CreateUserForm";

export default function Type({ cache }) {
    const [state, setState] = useUserReducer();
    const [passwordMode, setPasswordMode] = useState(AUTO_PASSWORD);

    const router = useRouter();

    const errorHandler = useClientErrorHandler();
    const { token = null, capabilities = [] } = cache;

    const { entity_type_slug, id } = router.query;
    const formRef = useRef();

    const onSubmit = (e) => {
        e.preventDefault();
        formRef.current.handleSubmit();
    };

    const formikParams = {
        innerRef: formRef,
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            forcePasswordChange: true,
            groups: [],
        },
        onSubmit: (values) => {
            (async () => {
                try {
                    setState(SAVING, true);

                    const url = `/api/admin/users`
                    const params = {
                        method: 'POST',
                        body: JSON.stringify({ ...values, passwordMode }),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }

                    await slsFetch(url, params);

                    setState(SET_MODAL_CONTENT, { title: "Success", text: "You have successfully created a user." });
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
                                    Add groups
                                </button>
                            </Link>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
                            <div>
                                <div className="general-header"> Create user </div>
                            </div>
                        </div>
                        <div className="row mt-4 mx-0 px-0">
                            <div className="col-12 mx-0 px-0 mb-2">
                                <div className="py-0 px-0 mb-3">
                                    <Formik {...formikParams}>
                                        <Form>
                                            <CreateUserForm passwordMode={passwordMode} setPasswordMode={setPasswordMode} />
                                        </Form>
                                    </Formik>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-center">
                            {capabilities.includes(writeUsers) &&
                                <>
                                    <AppButtonLg
                                        title="Cancel"
                                        onClick={!state.isSaving ? () => router.push(`/admin/users`) : null}
                                        className="general-button-cancel"
                                    />
                                    <AppButtonLg
                                        title={state.isSaving ? "Creating" : "Create"}
                                        icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon" />}
                                        onClick={onSubmit}
                                        isDisabled={state.isSaving || state.isSaving}
                                        className="general-button-save"
                                    />
                                </>
                            }
                        </div>
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
