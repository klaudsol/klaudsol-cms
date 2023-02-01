import { useState, useRef } from "react";
import { useFormikContext, useField } from "formik";
import Image from "next/image";
import AppButtonLg from "../klaudsolcms/buttons/AppButtonLg";

const FileField = (props) => {
  const [showImage, setShowImage] = useState("");
  const inputRef = useRef();
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const { onChange, value, ...formattedField } = field;

  const setFileValue = (e) => {
    const file = e.target.files[0];
    setShowImage(URL.createObjectURL(file));

    setFieldValue(field.name, file);
  };

  const openUploadMenu = () => inputRef.current.click();

  // Temporary. Create css class later. Can't think of a name right now
  const styles = {
    display: "flex",
    justifyContent: "center",
    position: "relative",
  };

  const buttonStyle = {
    // For aliging with the input
    // The input has a marginBottom: .5rem for some reason
    marginBottom: "0.5rem",
    marginLeft: 0,
  };

  const imgStyle = {
    textAlign: "center",
  };

  return (
    <div>
      <div style={styles}>
        <input
          type="file"
          {...props}
          {...formattedField}
          onChange={setFileValue}
          hidden="hidden"
          ref={inputRef}
        />
        <span className={props.className} onClick={openUploadMenu}>
          {value?.name}
        </span>
        <AppButtonLg
          title="Browse..."
          className="btn_general_lg--invert_colors"
          style={buttonStyle}
          onClick={openUploadMenu}
        />
      </div>
      {showImage && (
        <div className={props.className} style={imgStyle}>
          <Image
            src={showImage}
            alt="Your uploaded image"
            width={400}
            height={300}
            objectFit="contain"
          />
        </div>
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
