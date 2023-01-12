import { useEffect } from "react";
import { useFormikContext, useField } from "formik";

const DependentField = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const { format, inputToMirror, name } = props;
  const value = values[inputToMirror];

  // Remove inputToMirror & format props because it is not a legit input
  // attribute and it will give us a warning of we put it on an input element
  const propKeys = Object.keys(props);
  const initialValue = {};
  const filteredPropsReducer = (acc, curr) => {
    if (curr === "inputToMirror" || curr === "format") return acc;

    const newObj = { ...acc, [curr]: props[curr] };

    return newObj;
  };
  const filteredProps = propKeys.reduce(filteredPropsReducer, initialValue);

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
