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
        const file = e.target.files[0];

        if (!file) return;

        const randVal = await generateRandVals(5); // For deletion
        file.key = `${randVal}_${file.name}`

        const newFiles = [...value, file];

        setFieldValue(field.name, newFiles);
    };

    const openUploadMenu = (e) => {
        console.log(e);
        inputRef.current.click();

        const checkIfUnfocused = () => {
            if (!value) setTouched({ ...touched, [field.name]: true });

            document.body.onfocus = null;
        };

        document.body.onfocus = checkIfUnfocused;
    };

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
                {...formattedField}
            />
            {(!(value instanceof Array) || value.length === 0) && 
                <div className={`image-box ${errors[props.name] && touched[props.name] ? 'image-box--error' : ""}`} onClick={openUploadMenu}>
                    <BiUpload className="image-box__icon"/>
                    <p className="image-box__text"> Drop files here or click to upload </p>
                </div>
            }
            {(value instanceof Array && value.length > 0) &&
                <div className="card__container" onClick={openUploadMenu} >
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
                            <div className="card__data--container">
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
