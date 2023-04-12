import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

// Add validators in the future when "required" is optional
const RadioRenderer = ({ className, title, name, type, errors, touched, disabled, value, onChange, checked }) => {
    return (
        <>
            <label className="general-input-checkbox">
                <Field
                    type={type}
                    name={name}
                    disabled={disabled}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className="general-input-checkbox__checkbox"
                />
                <span className="general-input-checkbox__text">
                    {title}
                </span>
            </label>
            <ErrorRenderer name={name} errors={errors} touched={touched} />
        </>
    )
};

export default RadioRenderer;
