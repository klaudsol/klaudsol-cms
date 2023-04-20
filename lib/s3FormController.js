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

// values -> came from formik
export const getBody = async (values) => {
  // Probably the simplest solution. The other solution would be to use
  // multiple instances of array.reduce, but it would be much more complicated
    
  const data = {}; // The stuff that will be stored on the database
  const files = []; // The files that will be uploaded to S3
  const fileNames = []; // Needed so that we can generate presigned URLs

  const getValues = async (value, key, { isArray } = {}) => {
    if (value instanceof File) {
      const originalName = value.name;
      const uniqueKey = await generateUniqueKey(originalName);
      const type = value.type;

      data[key] = isArray ? [...data[key], uniqueKey] : uniqueKey;
      files.push(value);
      fileNames.push({ key: uniqueKey, originalName, type }); 
    } else if (value instanceof Object && value?.link) {
      data[key] = isArray ? [...data[key], value.key] : value.key;
    } else {
      data[key] = isArray ? [...data[key], value] : value;
    }
  }

  // O(n^2) solutuion. Can be improved, but I dont know how :(
  // What i'm trying to do is if there's an attribute that has multiple
  // values (ex. gallery), it will "flatten out" those values and include them on the data
  for (let key in values) {
    if (values[key] instanceof Array) {
        data[key] = [];

        for (let item of values[key]) {
            await getValues(item, key, { isArray: true });
        }
    } else {
        await getValues(values[key], key);
    }
  }

  return { data, files, fileNames };
}
