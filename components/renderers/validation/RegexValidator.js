import { CMS_TYPES } from "@/components/cmsTypes";
import { TYPES_REGEX } from "@/components/renderers/validation/TypesRegex";

const TypesValidator = (value, type) => {
  let errorMessage;
  if (!value || TYPES_REGEX.WHITESPACE.test(value))
    return (errorMessage = "Required"); // If value is undefined or if it only contains spaces, then return error

  switch (type) {
    case CMS_TYPES.FLOAT:
      if (!TYPES_REGEX.FLOAT.test(value)) {
        errorMessage = "Only numbers are allowed";
      }
      break;
    case CMS_TYPES.IMAGE:
      if (!TYPES_REGEX.IMAGE.test(value)) {
        errorMessage = "Invalid Image";
      }
      break;
    case CMS_TYPES.LINK:
      if (!TYPES_REGEX.LINK.test(value)) {
        errorMessage = "Invalid Link";
      }
      break;
    default:
      errorMessage = null;
  }
  return errorMessage;
};

export default TypesValidator;
