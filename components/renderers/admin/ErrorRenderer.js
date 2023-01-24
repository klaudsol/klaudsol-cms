import React from "react";

const ErrorRenderer = ({ name, errors, touched }) => (
  errors[name] &&
  touched[name] ? 
    <div style={{ color: "red" }}>{errors[name]}</div> : null
  );

export default ErrorRenderer;
