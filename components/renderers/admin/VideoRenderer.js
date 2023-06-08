import cx from "classnames";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";
import VideoField from "@/components/fields/VideoField";

const VideoRenderer = ({
  className,
  name,
  type,
  errors,
  touched,
  isErrorDisabled,
  accept,
  disabled,
  ...params
}) => (
  <>
    <VideoField
      accept={accept}
      name={name}
      className={cx("input_text mb-2", className)}
      //validate={(v) => TypesValidator(v, type)}
      style={
        !isErrorDisabled && errors[name] && touched[name]
          ? { borderColor: "red", outlineColor: "red" }
          : {}
      }
      {...params}
      hideUpload={disabled}
    />
    {!isErrorDisabled && (
      <ErrorRenderer name={name} errors={errors} touched={touched} />
    )}
  </>
);

export default VideoRenderer;
