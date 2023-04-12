import cx from "classnames";
import { Field, useFormikContext } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

// Add validators in the future when "required" is optional
const CheckboxRenderer = ({ className, title, name, type, errors, touched, disabled, value }) => {
    const { values } = useFormikContext();

    const isChecked = () => {
        const field = values[name];
        if (!(field instanceof Array)) return values[name];

        // formik converts everything to string if the field is not type = "number"
        return field.includes(value.toString()); 
    }

    return (
        <>
            <label className="general-input-checkbox">
                <Field
                    type="checkbox"
                    name={name}
                    value={value}
                    disabled={disabled}
                    checked={isChecked()}
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
export default CheckboxRenderer;
