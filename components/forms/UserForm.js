
import { useFormikContext } from "formik";
import { writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { useContext } from "react";
import CacheContext from "../contexts/CacheContext";

export default function UserForm() {
    const { errors, touched } = useFormikContext();
    const { capabilities } = useContext(CacheContext);

    return (
        <div className="mb-4">
            <h4>General info</h4>
            <div className="d-flex align-items-start gap-2">
                <div className="col">
                    <p className="general-input-title"> First Name </p>
                    <AdminRenderer
                        errors={errors}
                        touched={touched}
                        type="text"
                        name='firstName'
                        disabled={!capabilities.includes(writeUsers)}
                    />
                </div>
                <div className="col">
                    <p className="general-input-title"> Last Name </p>
                    <AdminRenderer
                        errors={errors}
                        touched={touched}
                        type="text"
                        name='lastName'
                        disabled={!capabilities.includes(writeUsers)}
                    />
                </div>
            </div>
            <p className="general-input-title"> Email </p>
            <AdminRenderer
                errors={errors}
                touched={touched}
                type="text"
                name='email'
                disabled={!capabilities.includes(writeUsers)}
            />
            <AdminRenderer
                title="Approved"
                errors={errors}
                touched={touched}
                type="checkbox"
                name='approved'
                disabled={!capabilities.includes(writeUsers)}
            />
            <AdminRenderer
                title="Login enabled"
                errors={errors}
                touched={touched}
                type="checkbox"
                name='loginEnabled'
                disabled={!capabilities.includes(writeUsers)}
            />
        </div>
    );
}
