import AttributeType from '@/components/attribute_types/AttributeType';
import { useFormikContext, useField } from "formik";
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const RichTextAttributeReadOnlyComponent = ({text}) => {
  // TODO: Refactor this to lib
  const MAX_STRING_LENGTH = 50;

  const truncate = (string)  => {
    return (string?.length && string.length > MAX_STRING_LENGTH) ? `${string.slice(0, MAX_STRING_LENGTH)}...` : string;   
  }

  // Get the text inside the html elements
  const extractTextFromHTML = (html) => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');
    return parsedDoc.body.textContent;
  };

  return (
    <>{truncate(extractTextFromHTML(text))}</>
  );
}

const RichTextEditableComponent = ({name, errors}) => {
  const { setFieldValue, setTouched, touched, values } = useFormikContext();
  const [{value}] = useField(name); 
  // sets the initial content of the editor state
  const initialContent = value ? value : null; // Initial HTML content
  const [editorState, setEditorState] = useState(initialContent);
  
  // Gets the HTML value from the editor and passes it to the formik field
  const handleConvertToHTML = (e) => {
    setEditorState(e);
    setFieldValue(name, e);
  };

  // Set the toolbar options
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // header options
    ['bold', 'italic', 'underline', 'strike'], // inline formatting options
    [{ list: 'ordered' }, { list: 'bullet' }], // list options
    ['link'], // link option
    [{ 'color': [] }, { 'background': [] }],
    ['undo', 'redo'],
  ];

  // Set the styles 
  const editorStyles = { 
    height: '200px', 
    marginBottom: '50px', 
    height: '300px'
  }
  
  return (
    <>
      <ReactQuill
        theme="snow"
        value={editorState}
        onChange={handleConvertToHTML}
        style={editorStyles}
        modules={{ toolbar: toolbarOptions }}
      />
    </>
  );
};

export default class RichTextAttributeType extends AttributeType {
  readOnlyComponent(){
    return RichTextAttributeReadOnlyComponent; 
  }
  
  editableComponent(){
    return RichTextEditableComponent;
  }
}