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
