import { useFormikContext } from "formik";
import { writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { useContext } from "react";
import CacheContext from "../contexts/CacheContext";

export default function AddToGroupsForm({ groups }) {
    const { values, errors, touched } = useFormikContext();
    const { capabilities } = useContext(CacheContext);

    const userCreated = groups.filter((group) => !group.isSystemSupplied);

    return (
        <div>
            <h4 className="mb-4">Groups</h4>
            <h5>System supplied</h5>
            <div className="groups__container">
                {groups.map((group) => {
                    // I purposely did not filter the list of system supplied groups
                    // for performance reasons (3-4 for loops vs 2-3 for loops)
                    if (!group.isSystemSupplied) return;

                    return (
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
                    )
                })}
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
