import { generateUniqueKey } from "@/backend/data_access/S3";

export const convertToFormData = (entry) => {
  const formData = new FormData();
  const propertyNames = Object.keys(entry);

  propertyNames.forEach((property) => {
    if (entry[property]?.key) {
      formData.append(property, entry[property].key);
      return;
    }

    formData.append(property, entry[property]);
  });

  return formData;
};

export const getAllFiles = (entry) => {
  const initialValue = {};
  const reducer = (acc, curr) => {
    if (!(entry[curr] instanceof File)) return acc;

    return { ...acc, [curr]: entry[curr] };
  };

  const entryKeys = Object.keys(entry);
  const allFiles = entryKeys.reduce(reducer, initialValue);

  return allFiles;
};

export const getBody = async (values) => {
  // Probably the simplest solution. The other solution would be to use
  // multiple instances of array.reduce, but its more complicated
  const data = {};
  const files = [];
  const fileNames = [];

  for (let key in values) {
    if (values[key] instanceof File) {
      const originalName = values[key].name;
      const uniqueKey = await generateUniqueKey(originalName);
      const type = values[key].type;

      data[key] = uniqueKey;
      files.push(values[key]);
      fileNames.push({ key: uniqueKey, originalName, type });
    } else if (values[key] instanceof Object && values[key]?.link) {
      data[key] = values[key].key;
    } else {
      data[key] = values[key];
    }
  }

  return { files, data, fileNames };
};
