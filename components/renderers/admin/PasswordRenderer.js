import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";
import { BiShow, BiHide } from "react-icons/bi";
import { useState } from "react";

const PasswordRenderer = ({ className, name, type, errors, touched, disabled, readOnly }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="general-input-password-box">
                <Field
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    className={cx("general-input-text", {
                        "general-input-error": errors[name] && touched[name],
                    })}
                    validate={(v) => TypesValidator(v, type)}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoComplete="true"
                />
                <button
                    type="button"
                    className="general-input-password-box-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    {showPassword ? <BiHide /> : <BiShow />}
                </button>
            </div>
            <ErrorRenderer name={name} errors={errors} touched={touched} />
        </>
    )
};
export default PasswordRenderer;
