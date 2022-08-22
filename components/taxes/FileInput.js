import { useRef } from "react";

import styles from "@/styles/taxes/TaxesPage.module.scss"

const FileInput = ({ accept, fileName, onFileChange }) => {
    const inputRef = useRef();

    return (
        <span>
            <input type="file" 
                   accept={accept}
                   onChange={onFileChange}
                   style={{ display: "none" }}
                   ref={inputRef}
                   />
            <button className={styles["button"]} onClick={(e) => inputRef.current.click()}>Choose File</button>
            <span>{fileName || "No file chosen."}</span>
        </span>
    );
}

export default FileInput;