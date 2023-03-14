import cx from "classnames";
import { Field } from "formik";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const TextAreaRenderer = ({ 
  className, 
  name, 
  type, 
  errors, 
  touched
}) => (
  <>
    <Field
      type="textarea"
      name={name}
      validate={(v) => TypesValidator(v, type)}
    >
      {({ field }) => (
        <textarea
          className={cx("general-input-textarea", 
          {"general-input-error": errors[name] && touched[name]})}
          {...field}
        />
      )}
    </Field>
    <ErrorRenderer 
      name={name} 
      errors={errors} 
      touched={touched} 
    />
  </>
);

export default TextAreaRenderer;
