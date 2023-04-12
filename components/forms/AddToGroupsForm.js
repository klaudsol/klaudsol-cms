import { getSessionCache } from "@klaudsol/commons/lib/Session";

import { useFormikContext, Form } from "formik";
import { AUTO_PASSWORD, CUSTOM_PASSWORD, writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { useContext, useEffect, useState } from "react";
import { generateRandVals } from "@klaudsol/commons/lib/Math";
import CacheContext from "../contexts/CacheContext";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { LOADING, SET_VALUES, SAVING } from "@/lib/actions";

export default function AddToGroupsForm({ groups }) {
    const { setFieldValue, values, errors, touched } = useFormikContext();
    const { capabilities, token } = useContext(CacheContext);

    return (
        <>
            <h4>System supplied</h4>
            <div className="groups__container">
                {groups.map((group) => {
                    if (!group.isSystemSupplied) return;

                    return (
                        <div className="groups__item" key={group.id}>
                            <AdminRenderer
                                title={group.name}
                                value={group.id}
                                errors={errors}
                                touched={touched}
                                checked={values.groups.includes(group.id)}
                                type="checkbox"
                                name="groups"
                                disabled={!capabilities.includes(writeUsers)}
                            />
                            <p className="groups__description">{group.description}</p>
                        </div>
                    )
                })}
            </div>
            <h4>Created</h4>
            <div className="groups__container">
                {groups.map((group) => {
                    if (group.isSystemSupplied) return;

                    return (
                        <div className="groups__item" key={group.id}>
                            <AdminRenderer
                                title={group.name}
                                value={group.id}
                                errors={errors}
                                touched={touched}
                                checked={values.groups.includes(group.id)}
                                type="checkbox"
                                name="groups"
                                disabled={!capabilities.includes(writeUsers)}
                            />
                            <p className="groups__description">{group.description}</p>
                        </div>
                    )
                })}
            </div>
        </>
    );
}
