import cx from "classnames";
import { Field } from "formik";
import FileField from "@/components/fields/FileField";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const TextRenderer = ({ className, name, type, errors, touched }) => {
  /* const setFileTovalues = (e) => { */
  /*   console.log(e.target.files); */
  /* }; */

  return (
    <>
      {type === "file" ? (
        <FileField
          type={type}
          name={name}
          className={cx("input_text mb-2", className)}
          validate={(v) => TypesValidator(v, type)}
          style={
            errors[name] && touched[name]
              ? { borderColor: "red", outlineColor: "red" }
              : {}
          }
        />
      ) : (
        <Field
          type={type}
          name={name}
          className={cx("input_text mb-2", className)}
          validate={(v) => TypesValidator(v, type)}
          style={
            errors[name] && touched[name]
              ? { borderColor: "red", outlineColor: "red" }
              : {}
          }
        />
      )}
      <ErrorRenderer name={name} errors={errors} touched={touched} />
    </>
  );
};

export default TextRenderer;
