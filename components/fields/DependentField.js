import { useEffect } from "react";
import { useFormikContext, useField } from "formik";

const DependentField = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const { format, inputToMirror, name, ...filteredProps } = props;
  filteredProps.name = name;
  const value = values[inputToMirror];

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

// HOW IT WORKS:
// This field accepts all of the atrributes of an input, and two special attributes:
// The 'name' of the input to mirror (inputToMirror), and the optional format function (format).
// We need the name of the input that we need to mirror so that we can mirror it,
// and the format function lets us format our mirrored input.
