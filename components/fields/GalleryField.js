import { useState, useRef } from "react";
import { useFormikContext, useField } from "formik";
import Image from "next/image";
import AppButtonLg from "../klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import { SET_CHANGED } from "@/lib/actions"
import { generateRandVals } from "@klaudsol/commons/lib/Math";

const GalleryField = (props) => {
    const { setFieldValue, setTouched, touched } = useFormikContext();

    const [field] = useField(props);
    const { onChange, value, ...formattedField } = field;

    const [files, setFiles] = useState(value || []);
    const [showDelete, setDelete] = useState(false);

    const inputRef = useRef();

    const setFileValue = async (e) => {
        const file = e.target.files[0];

        if (!file) return;
        file.key = await generateRandVals(5); // For deletion

        const newFiles = [...files, file];
        setFiles(newFiles);
        setFieldValue(field.name, newFiles);
    };

    const openUploadMenu = (e) => {
        if (e.target.nodeName === 'path' || e.target.nodeName === 'svg' || e.target.nodeName === "BUTTON") return;
        inputRef.current.click();

        const checkIfUnfocused = () => {
            if (!value) setTouched({ ...touched, [field.name]: true });

            document.body.onfocus = null;
        };

        document.body.onfocus = checkIfUnfocused;
    };

    const removeItem = (key) => {
        const newFiles = files.filter((file) => file.key !== key);

        setFiles(newFiles);
        setFieldValue(field.name, newFiles);
    }

    return (
        <>
            <input
                accept={props.accept}
                type="file"
                onChange={setFileValue}
                hidden="hidden"
                ref={inputRef}
                {...formattedField}
            />
            <div
                className="card__container"
                onClick={openUploadMenu}
            >
                {value.length === 0 && <p>UPLOAD HERE</p>}
                {value.length > 0 &&
                    files.map((image, i) => (
                        <div
                            key={i}
                            className="card__item"
                        >
                            <div className="card__image-container">
                                <div className="card__side-button-container">
                                    <button type="button" onClick={() => removeItem(image?.key)} className="card__side-button card__side-button--delete">
                                        <FaTrash />
                                    </button>
                                </div>
                                <Image
                                    src={image?.link ?? URL.createObjectURL(image)}
                                    alt={image?.name}
                                    className="card__image"
                                    sizes={290}
                                    fill
                                />
                            </div>
                            <div className="card__data--container">
                                <div className="card__data">{image.name}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default GalleryField;
