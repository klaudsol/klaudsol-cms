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
      type="textarea"
      name={name}
      className={cx("input_textarea", className)}
      validate={(v) => TypesValidator(v, type)}
      style={
        errors[name] && touched[name]
          ? { borderColor: "red", outline: "none" }
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
