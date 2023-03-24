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

export const getBody = (values) => {
  // Probably the simplest solution. The other solution would be to use
  // array.reduce, but its more complicated
  let files = {};
  let nonFiles = {};

  for (let key in values) {
    if (values[key] instanceof File) {
      files = { ...files, [key]: values[key] };
    } else {
      nonFiles = { ...nonFiles, [key]: values[key] };
    }
  }

  return { files, nonFiles };
};
