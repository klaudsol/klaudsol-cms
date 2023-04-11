import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

// Add validators in the future when "required" is optional
const CheckboxRenderer = ({ className, title, name, type, errors, touched, disabled }) => (
    <>
        <label className="general-input-checkbox">
            <Field
                type="checkbox"
                name={name}
                disabled={disabled}
                className="general-input-checkbox__checkbox"
            />
            <span className="general-input-checkbox__text">
                {title}
            </span>
        </label>
        <ErrorRenderer name={name} errors={errors} touched={touched} />
    </>
);
export default CheckboxRenderer;
