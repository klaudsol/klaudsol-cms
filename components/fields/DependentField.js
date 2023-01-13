import { useEffect } from "react";
import { useFormikContext, useField } from "formik";

const DependentField = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const { format, fieldToMirror, name, ...filteredProps } = props;
  filteredProps.name = name;
  const value = values[fieldToMirror];

  useEffect(() => {
    const outputVal = format(value);
    setFieldValue(name, outputVal);
  }, [value]);

  return <input {...filteredProps} {...field} />;
};

DependentField.defaultProps = {
  format: (value) => value,
};

export default DependentField;

// NOTES:
// This is an extension of the formik library, so this component only works if
// it is a child of a <Formik> component. It only mirrors the <Field> component
// of formik, and it does not work on a regular Input element.

// HOW IT WORKS:
// This field accepts all of the atrributes of an input, and two special attributes:
// The 'name' of the <Field> element to mirror (fieldToMirror), and the optional
// format function (format). We need the name of the <Field> element that
// we need to mirror so that we can mirror it, and the format function lets us
// format our mirrored input.
