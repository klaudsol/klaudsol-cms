import { useFormikContext } from "formik";
import { promoteToSuperAdmin, SUPER_ADMIN_ID, writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { useContext } from "react";
import CacheContext from "../contexts/CacheContext";

export default function AddToGroupsForm({ groups }) {
    const { values, errors, touched } = useFormikContext();
    const { capabilities } = useContext(CacheContext);

    const systemSupplied = groups.filter((group) => group.isSystemSupplied);
    const userCreated = groups.filter((group) => !group.isSystemSupplied);

    return (
        <div>
            <h4 className="mb-4">Groups</h4>
            <h5>System supplied</h5>
            <div className="groups__container">
                <div className="groups__item" >
                    <AdminRenderer
                        title="Super Administrator"
                        value={SUPER_ADMIN_ID}
                        errors={errors}
                        touched={touched}
                        checked={values.groups.includes(SUPER_ADMIN_ID.toString())}
                        type="checkbox"
                        name="groups"
                        disabled={!capabilities.includes(writeUsers)}
                    />
                    <p className="groups__description">Reserved group for KlaudSol installation and setup.</p>
                </div>
                {systemSupplied.map((group) => (
                    <div className="groups__item" key={group.id}>
                        <AdminRenderer
                            title={group.name}
                            value={group.id}
                            errors={errors}
                            touched={touched}
                            checked={values.groups.includes(group.id.toString())}
                            type="checkbox"
                            name="groups"
                            disabled={!capabilities.includes(writeUsers)}
                        />
                        <p className="groups__description">{group.description}</p>
                    </div>
                ))}
            </div>
            {userCreated.length > 0 &&
                <>
                    <h5>Created</h5>
                    <div className="groups__container">
                        {userCreated.map((group) => (
                            <div className="groups__item" key={group.id}>
                                <AdminRenderer
                                    title={group.name}
                                    value={group.id}
                                    errors={errors}
                                    touched={touched}
                                    checked={values.groups.includes(group.id.toString())}
                                    type="checkbox"
                                    name="groups"
                                    disabled={!capabilities.includes(writeUsers)}
                                />
                                <p className="groups__description">{group.description}</p>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div >
    );
}
