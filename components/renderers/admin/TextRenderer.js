import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const TextRenderer = ({ className, name, type, errors, touched, disabled, optional }) => (
  <>
    <Field
      type="text"
      name={name}
      className={cx("general-input-text", {
        "general-input-error": errors[name] && touched[name],
      })}
      //validate={optional ? null : (v) => TypesValidator(v, type)}
      disabled={disabled}
    />
    {!optional && <ErrorRenderer name={name} errors={errors} touched={touched} />}
  </>
);
export default TextRenderer;
