import cx from "classnames";
import GalleryField from "@/components/fields/GalleryField";
import TypesValidator from "@/components/renderers/validation/RegexValidator";
import ErrorRenderer from "./ErrorRenderer";

const GalleryRenderer = ({
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
        <GalleryField
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

export default GalleryRenderer;
