import CacheContext from "@/components/contexts/CacheContext";

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";

import { FaCheck, FaTrash, FaArrowRight } from "react-icons/fa";
import { Formik, Form } from "formik";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import { changeUserPassword, DEFAULT_SKELETON_ROW_COUNT, deleteUsers, writeUsers } from "lib/Constants";

import {
    LOADING,
    SAVING,
    DELETING,
    SET_MODAL_CONTENT,
    SET_VALUES,
    SET_GROUPS,
} from "@/lib/actions";

import useUserReducer from "@/components/reducers/userReducer";
import UserForm from "@/components/forms/UserForm";
import AddToGroupsForm from "@/components/forms/AddToGroupsForm";

export default function UserInfo({ cache }) {
    const [state, setState] = useUserReducer();

    const router = useRouter();

    const errorHandler = useClientErrorHandler();
    const { capabilities } = cache;

    if (!capabilities.includes(writeUsers)) router.push('/admin');

    const { entity_type_slug, id } = router.query;
    const formRef = useRef();

    useEffect(() => {
        (async () => {
            try {
                setState(LOADING, true);

                const userDataUrl = `/api/admin/users/${id}`;
                const userParams = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                const groupsUrl = `/api/admin/groups`;
                const groupsParams = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                const groupsPromise = slsFetch(groupsUrl, groupsParams);
                const userPromise = slsFetch(userDataUrl, userParams);
                const [groupsRaw, userRaw] = await Promise.all([groupsPromise, userPromise]);

                const { data: user } = await userRaw.json();
                const { person, groups: userGroups } = user;

                const { data: groups } = await groupsRaw.json();

                setState(SET_VALUES, { ...person[0], groups: userGroups });
                setState(SET_GROUPS, groups);
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

                    const toAdd = values.groups.filter((group) => !state.user.groups.includes(group));
                    const toDelete = state.user.groups.filter((group) => !values.groups.includes(group));

                    const url = `/api/admin/users/${id}`
                    const params = {
                        method: 'PUT',
                        body: JSON.stringify({ ...values, toAdd, toDelete, isSameEmail }),
                        headers: {
                            'Content-Type': 'application/json',
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
                            {capabilities.includes(changeUserPassword) &&
                                <Link href={`/admin/users/${id}/password`}> {/* I just copied AppBackButton */}
                                    <button className="btn_back">
                                        <FaArrowRight className='icon_general' />
                                        Change Password
                                    </button>
                                </Link>
                            }
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
                            <div className="general-header"> Edit user </div>
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
                                            <Form>
                                                <UserForm />
                                                <AddToGroupsForm groups={state.groups} />
                                            </Form>
                                        </Formik>

                                    )}
                                </div>
                            </div>
                        </div>
                        {!state.isLoading &&
                            <div className="d-flex flex-row justify-content-center">
                                {capabilities.includes(writeUsers) &&
                                    <AppButtonLg
                                        title="Delete"
                                        icon={state.isDeleting ? <AppButtonSpinner /> : <FaTrash className="general-button-icon" />}
                                        onClick={onDelete}
                                        className="general-button-delete"
                                        isDisabled={state.isDeleting || state.isSaving}
                                    />
                                }
                                {capabilities.includes(deleteUsers) &&
                                    <AppButtonLg
                                        title={state.isSaving ? "Saving" : "Save"}
                                        icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon" />}
                                        onClick={onSubmit}
                                        isDisabled={state.isSaving || state.isSaving}
                                        className="general-button-save"
                                    />
                                }
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
