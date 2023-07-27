import AttributeType from '@/components/attribute_types/AttributeType';
import { validFileTypes } from '@/lib/Constants';
import { useFormikContext, useField } from "formik";
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineFilePdf, AiOutlineFileText, AiOutlineFileWord } from 'react-icons/ai';
import { FaDownload, FaFile } from 'react-icons/fa';
import path from 'path';

const getFileType = (filePath) => {
    const fileExtension = path.extname(filePath);
    return fileExtension.toLowerCase();
  }

const FileAttributeReadOnlyComponent = ({text}) => {
  // TODO: Refactor this to lib
  const MAX_STRING_LENGTH = 50;

  const truncate = (string)  => {
    return (string?.length && string.length > MAX_STRING_LENGTH) ? `${string.slice(0, MAX_STRING_LENGTH)}...` : string;   
  }

  return (
    <>{truncate(text?.name)}</>
  );
}

const FileEditableComponent = ({name, errors}) => {
  const { setFieldValue, setTouched, touched, values } = useFormikContext();
  const [{value}] = useField(name); 

  const selectedFileType = value?.name ? getFileType(value.name) : null;
  const [fileName, setFileName] = useState(value?.name ?? null);
  const [fileType, setFileType] = useState(selectedFileType);

  const setFileValue = (e) => {
    const file = e.target.files[0];
    if(!file) return
    setFileName(e.target.files[0].name);
    setFileType(e.target.files[0].type);
    setFieldValue(name, file);
  };

  return (
    <div className='general-file-col'> 
       <input
          accept={validFileTypes}
          type="file"
          onChange={setFileValue}
          id="fileAttributeType"
          hidden="hidden"
        />
        
        <label htmlFor='fileAttributeType'  className='general-file-row'>
          <div className='general-file-label'>{fileName ? fileName : 'No file chosen'}</div>
          <div className='general-file-button'>Browse</div>
        </label>
        {value && value.link && 
        <div className='general-file'>
          {fileType === '.docx' ? <AiOutlineFileWord className='general-file-icon'/> : fileType === '.pdf' ? <AiOutlineFilePdf className='general-file-icon'/> : <AiOutlineFileText className='general-file-icon'/> }
          <Link href={value?.link} className='general-file-button-download'><><FaDownload /><div className='general-file-name'>{value.name}</div></></Link>
        </div>}
    </div>
  );
};

export default class FileAtrributeType extends AttributeType {
  readOnlyComponent(){
    return FileAttributeReadOnlyComponent; 
  }
  
  editableComponent(){
    return FileEditableComponent;
  }
}