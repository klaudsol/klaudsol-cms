import { useState, useRef } from "react";
import { useFormikContext, useField } from "formik";
import Image from "next/image";
import AppButtonLg from "../klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import {  SET_CHANGED } from "@/lib/actions" 

const VideoField = (props) => {
  const { setFieldValue, setTouched, touched } = useFormikContext();
  const [field] = useField(props);

  const { onChange, value, ...formattedField } = field;

  const [staticLink,setStaticLink] = useState('');
  const inputRef = useRef();
  const isFetching = props.isSaving || props.isDeleting; 

  useEffect(()=>{
   if(props.resetOnNewData) { 
    !value instanceof File  && setStaticLink('');
    inputRef.current.value = '';
  }
  },[value,props.resetOnNewData])

  const setFileValue = (e) => {
    const file = e.target.files[0];

    if(!file) return

    setStaticLink(URL.createObjectURL(file));
    props?.dispatch && props.dispatch({ type: SET_CHANGED, payload:true })
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
          accept={props.accept}
          type="file"
          onChange={setFileValue}
          hidden="hidden"
          ref={inputRef}
          {...formattedField}
        />
        {!props.offName && (
          <span
            className={props.className}
            style={props.style}
            value={value?.name || ""}
            onClick={openUploadMenu}
          >
            {value?.name}
          </span>
        )}
        {!props.hideUpload && <AppButtonLg
          title={props.buttonPlaceholder ?? "Browse..."}
          className="btn_general_lg--invert_colors field_btn"
          onClick={openUploadMenu}
          isDisabled={isFetching || props.disableAllButtons}
        />}
        {props.showDeleteButton && (
          <button
            className={`new_entry_block_button_delete logo ${isFetching && `delete`}`}
            onClick={()=>{props.onDelete(setStaticLink)}}
            type="button"
            disabled={isFetching || props.disableAllButtons}
          >
            <div>
              {props.isDeleting ? (
                <AppButtonSpinner height={10} />
              ) : (
                <FaTrash className="icon_block_button" />
              )}
            </div>
            <p>Remove</p>
          </button>
        )}
      </div>
      {(value || staticLink) && (
        <div className="attr-video-container">
          <video 
            src={value?.link ?? staticLink} 
            controls 
            className="attr-video"
          />
        </div>
      )}
    </div>
  );
};

export default VideoField;

// NOTES:
// This is an extension of the formik library, so this component only works if
// it is a child of a <Formik> component. It takes in a file as an input, then
// saves it as form data on state.

// HOW IT WORKS:
// This field is specifically for uploading images because if we were to use the
// regular field input without any modifications, then the only the path of the
// file will be stored, not the file itself. There's also multiple elements
// aside from an input box due to styling
