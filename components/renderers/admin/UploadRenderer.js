import cx from "classnames";
import FileField from "@/components/fields/FileField";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const UploadRenderer = ({ className, name, type, errors, touched, isErrorDisabled, accept, ...params }) => (
  <>
    <FileField
      accept={accept}
      name={name}
      className={cx("input_text mb-2", className)}
      validate={(v) => TypesValidator(v, type)}
      style={ !isErrorDisabled &&
        errors[name] && touched[name]
          ? { borderColor: "red", outlineColor: "red" }
          : {}
      }
      {...params}
    />
    {!isErrorDisabled && <ErrorRenderer name={name} errors={errors} touched={touched} />}
  </>
);

export default UploadRenderer;
