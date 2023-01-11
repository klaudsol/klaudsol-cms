import { useEffect } from "react";
import { useFormikContext, useField } from "formik";

const DependentField = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const { format, inputToMirror } = props;
  const value = values[inputToMirror];

  // Remove inputToMirror & format pros because it is not a legit input
  // attribute and it will give us a warning of we put it on input
  const filteredProps = Object.keys(props).reduce((acc, curr) => {
    if (curr === "inputToMirror" || curr === "format") return acc;

    acc[curr] = props[curr];
    return acc;
  }, {});

  useEffect(() => {
    const outputVal = format(value);
    setFieldValue(props.name, outputVal);
  }, [value]);

  return <input {...filteredProps} {...field} />;
};

DependentField.defaultProps = {
  format: (value) => value,
};

export default DependentField;
