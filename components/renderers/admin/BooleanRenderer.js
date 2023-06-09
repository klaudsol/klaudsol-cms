import cx from "classnames";
import { Field, useFormikContext } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

// Add validators in the future when "required" is optional
const BooleanRenderer = ({ className, title, name, type, errors, touched, disabled, value }) => {
    const { values } = useFormikContext();

    const isChecked = () => {
      let checked = false;
      const field = values[name];
      if (field) {
        checked = true;
      }
      return checked; 
    }

    return (
        <>
            <label className="attr-boolean">
                <Field
                    type="checkbox"
                    name={name}
                    value={value}
                    disabled={disabled}
                    checked={isChecked()}
                    className="attr-boolean-checkbox"
                />
                <div className="attr-boolean-text">{title}</div>
            </label>
            <ErrorRenderer name={name} errors={errors} touched={touched} />
        </>
    )
};
export default BooleanRenderer;
