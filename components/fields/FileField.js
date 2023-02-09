import { useState, useRef } from "react";
import { useFormikContext, useField } from "formik";
import Image from "next/image";
import AppButtonLg from "../klaudsolcms/buttons/AppButtonLg";

const FileField = (props) => {
  const { setFieldValue, setTouched, touched } = useFormikContext();
  const [field] = useField(props);
  
  console.log(props)
  console.log(field)

  const { onChange, value, ...formattedField } = field;

  const [imageLink, setImageLink] = useState(value && value.link);
  const inputRef = useRef();

  const setFileValue = (e) => {
    const file = e.target.files[0];

    setImageLink(URL.createObjectURL(file));

    setFieldValue(field.name, file);
  };

  const openUploadMenu = () => {
    inputRef.current.click();

    const checkIfUnfocused = () => {
      if (!value) setTouched({ ...touched, [field.name]: true });
      
      document.body.onfocus = null;
    };

    document.body.onfocus = checkIfUnfocused;
  };

  return (
    <div>
      <div className="field_base">
        <input
          type="file"
          onChange={setFileValue}
          hidden="hidden"
          ref={inputRef}
          {...formattedField}
        />
        <span
          className={props.className}
          style={props.style}
          value={value?.name || ""}
          onClick={openUploadMenu}
        >
          {value?.name}
        </span>
        <AppButtonLg
          title="Browse..."
          className="btn_general_lg--invert_colors field_btn"
          onClick={openUploadMenu}
        />
      </div>
      {imageLink && (
        <Image
          src={imageLink}
          alt={value.name}
          width={800}
          height={300}
          loading="lazy"
          className={`${props.className} field_image`}
        />
      )}
    </div>
  );
};

export default FileField;

// NOTES:
// This is an extension of the formik library, so this component only works if
// it is a child of a <Formik> component. It takes in a file as an input, then
// saves it as form data on state.

// HOW IT WORKS:
// This field is specifically for uploading images because if we were to use the
// regular field input without any modifications, then the only the path of the
// file will be stored, not the file itself. There's also multiple elements
// aside from an input box due to styling
