import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const FloatRenderer = ({ className, name, type, ...params }) => (
  <>
    <Field
      type="float"
      name={name}
      className={cx("input_text mb-2", className)}
      validate={(v) => TypesValidator(v, type)}
    />
    <ErrorRenderer name={name} {...params} />
  </>
);

export default FloatRenderer;
