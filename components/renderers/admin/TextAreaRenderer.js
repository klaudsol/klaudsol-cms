import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const TextRenderer = ({ className, name, type, ...params }) => (
  <>
    <Field
      type="textarea"
      name={name}
      className={cx("input_textarea", className)}
      validate={(v) => TypesValidator(v, type)}
    />
    <ErrorRenderer name={name} {...params} />
  </>
);

export default TextRenderer;
