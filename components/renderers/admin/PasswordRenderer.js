import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";
import { BiShow, BiHide } from "react-icons/bi";
import { useState } from "react";

const PasswordRenderer = ({ className, name, type, errors, touched, button, disabled, readOnly }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="general-input-password">
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
                <div className="general-input-password-box">
                    {button && 
                        <button 
                            className="general-input-password-button"
                            type="button"
                            onClick={button.onClick}
                        >
                            {button.icon}
                        </button>
                    }
                    <button
                        className="general-input-password-button"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <BiHide /> : <BiShow />}
                    </button>
                </div>
            </div>
            <ErrorRenderer name={name} errors={errors} touched={touched} />
        </>
    )
};
export default PasswordRenderer;
