import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const TextRenderer = ({ className, name, type, errors, touched, disabled }) => (
  <>
    <Field
      type="text"
      name={name}
      className={cx("general-input-text", {
        "general-input-error": errors[name] && touched[name],
      })}
      validate={(v) => TypesValidator(v, type)}
      disabled={disabled}
    />
    <ErrorRenderer name={name} errors={errors} touched={touched} />
  </>
);
export default TextRenderer;
