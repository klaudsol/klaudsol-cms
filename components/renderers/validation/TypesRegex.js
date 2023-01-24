export const TYPES_REGEX = {
  TEXT: /^(?!\s*$)[\S\s]+$/,
  IMAGE: /^.*\.(jpg|jpeg|png|gif|bmp)$/,
  LINK: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  FLOAT: /^-?[0-9]*\.?[0-9]+$/,
  WHITESPACE: /^[\s]+$/,
};
