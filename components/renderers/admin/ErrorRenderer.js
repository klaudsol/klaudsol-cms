import React from "react";

const ErrorRenderer = ({ name, errors, touched }) => (
  errors[name] &&
  touched[name] ?
    <div className="general-input-error-text">{errors[name]}</div> : null
  );

export default ErrorRenderer;
