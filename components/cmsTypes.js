export const CMS_TYPES = {
  TEXT: "text",
  TEXT_AREA: "textarea",
  FLOAT: "float",
  LINK: "link",
  IMAGE: "image",
  GALLERY: "gallery",
  VIDEO: "video",
  BOOLEAN: "boolean",
  // Not sure if I should include the password and the checkbox here
  // since they are not attribute types. I included it so that
  // the AdminRenderer component can function properly
  PASSWORD: "password",
  CHECKBOX: "checkbox",
  CUSTOM: "custom",
  RICH_TEXT: "rich-text",
  FILE: "file"
};

// resources types
export const stringTypes = [
  "text",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/png",
  "link",
];

export const imageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/png",
];


// values to be added in future
export const longStringTypes = ["textarea"];
export const longValueTypes = ["number"];
export const resourceValueTypes = [
  "value_string",
  "value_long_string",
  "value_double",
  "value_boolean",
];

