import { useFormikContext, useField } from "formik";

const FileField = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const { onChange, value, ...formattedField } = field;

  const setFileValue = (e) => {
    const file = e.target.files[0];

    setFieldValue(field.name, file);
  };

  return <input {...props} {...formattedField} onChange={setFileValue} />;
};

export default FileField;

// NOTES:
// This is an extension of the formik library, so this component only works if
// it is a child of a <Formik> component. It takes in a file as an input, then
// saves it as form data on state.

// HOW IT WORKS:
// This field accepts all of the atrributes of an input, and two special attributes:
// The 'name' of the <Field> element to mirror (fieldToMirror), and the optional
// format function (format). We need the name of the <Field> element that
// we need to mirror so that we can mirror it, and the format function lets us
// format our mirrored input.
