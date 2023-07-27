export const inputValues = [
  { value: "text", option: "Text" },
  { value: "textarea", option: "Text Area" },
  { value: "rich-text", option: "Rich Text" },
  { value: "link", option: "Link" },
  { value: "image", option: "Image" },
  { value: "gallery", option: "Gallery" },
  { value: "float", option: "Number" },
  { value: "video", option: "Video" },
  { value: "boolean", option: "Boolean" },
  { value: "file", option: "File" },
  { value: "custom", option: "Custom" }
];

export const COLLECTION_ENTITY_TYPE_VARIANT = 'collection';
export const SINGLETON_ENTITY_TYPE_VARIANT = 'singleton';
export const entityTypeVariants = [
  { value: COLLECTION_ENTITY_TYPE_VARIANT, option: "Collection" },
  { value: SINGLETON_ENTITY_TYPE_VARIANT, option: "Singleton" },
];

export const entityTypeVariantsEnum = {
  collection: "collection",
  singleton: "singleton"
};

export const defaultEntityTypeVariant = 'collection';

export const defaultLogo = {
  link: "/logo-180x180.png",
  default: true,
  name: "defaultLogo",
  display: "(Default)",
};
export const mainlogo = 'mainlogo';

export const operators = {
  $eq: "IN",
  $lt: "<",
  $lte: "<=",
  $gt: ">",
  $gte: ">=",
  $contains: "LIKE",
  $notContains: "NOT LIKE",
};

export const slugTooltipText = "Slugs are the URL-friendly names of your contents. You can access the contens in your API via their numerical ID (e.g. /api/articles/12) or their slug (e.g. /api/articles/my-first-blog-post)";

