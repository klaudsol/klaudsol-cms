import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const TextRenderer = ({ 
  className, 
  name, 
  type, 
  errors, 
  touched }) => (
  <>
    <Field
      type="text"
      name={name}
      className={cx("input_text mb-2", className)}
      validate={(v) => TypesValidator(v, type)}
      style={
        errors[name] && touched[name]
          ? { borderColor: "red", outlineColor: "red" }
          : {}
      }
    />
    <ErrorRenderer 
      name={name} 
      errors={errors} 
      touched={touched} 
      />
  </>
);

export default TextRenderer;
