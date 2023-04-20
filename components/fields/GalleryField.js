import { useRef } from "react";
import Image from "next/image";
import { useFormikContext, useField } from "formik";
import { FaTrash } from "react-icons/fa";
import { BiUpload } from "react-icons/bi";
import { generateRandVals } from "@klaudsol/commons/lib/Math";

const GalleryField = (props) => {
    const { setFieldValue, setTouched, touched, errors } = useFormikContext();

    const [field] = useField(props);
    const { onChange, value, ...formattedField } = field;

    const inputRef = useRef();

    const setFileValue = async (e) => {
        const filesListRaw = Array.from(e.target.files);

        if (!filesListRaw || filesListRaw.length === 0) return;

        const fileListPromise = filesListRaw.map(async (file) => {
            const randVal = await generateRandVals(5); // For deletion
            file.key = `${randVal}_${file.name}`

            return file;
        });

        const updatedFilesList = await Promise.all(fileListPromise);

        const files = [...value, ...updatedFilesList];

        setFieldValue(field.name, files);
    };

    const openUploadMenu = () => {
        inputRef.current.click();

        const checkIfUnfocused = () => {
            if (!value) setTouched({ ...touched, [field.name]: true });

            document.body.onfocus = null;
        };

        document.body.onfocus = checkIfUnfocused;
    };

    const openNonEmptyUploadMenu = (e) => {
        if (e.target.nodeName === 'path' || e.target.nodeName === 'svg' || e.target.nodeName === "BUTTON") return;

        openUploadMenu();
    }

    const removeItem = (key) => {
        const newFiles = value.filter((file) => file.key !== key);

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
                multiple="multiple"
                {...formattedField}
            />
            {(!(value instanceof Array) || value.length === 0) && 
                <div className={`image-box ${errors[props.name] && touched[props.name] ? 'image-box--error' : ""}`} onClick={openUploadMenu}>
                    <BiUpload className="image-box__icon"/>
                    <p className="image-box__text"> Click me to upload images </p>
                </div>
            }
            {(value instanceof Array && value.length > 0) &&
                <div className="card__container card__container--attribute" onClick={openNonEmptyUploadMenu} >
                    {value.map((image, i) => (
                        <div
                            key={i}
                            className="card__item"
                        >
                            <div className="card__image-container">
                                <div className="card__side-button-container">
                                    <button type="button" onClick={() => removeItem(image.key)} className="card__side-button card__side-button--delete">
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
                            <div className="card__data-container">
                                <div className="card__data">{image.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    );
};

export default GalleryField;
