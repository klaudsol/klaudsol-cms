const formatMultipleValues = (collection, item, format = () => {}) => {
    
    let prevValues;
    if (collection?.indexedData) {
        prevValues = collection.indexedData[item.id]?.[item.attributes_name] ?? [];
    } else {
        prevValues = collection.data[item.attributes_name] ?? [];
    }

    const newValues = [...prevValues, format(item.value_string)];

    return newValues;
}

const formatImage = (key) => {
    if (!key) return;

    const bucketBaseUrl = process.env.KS_S3_BASE_URL;

    const name = key.substring(key.indexOf('_') + 1);
    const keyForLink = key.split(' ').join('+');
    const link = `${bucketBaseUrl}/${keyForLink}`

    return { name, key, link }
}

  export const resolveValue = (collection, item) => {
    switch(item.attributes_type) {
      case 'text':
      case 'link':
        return item.value_string;
      case 'textarea':
        return item.value_long_string;
      case 'image':
        if(!item.value_string) return;
        const imageValues = formatImage(item.value_string);
        
        return imageValues;
      case 'gallery':
        const galleryValues = formatMultipleValues(collection, item, formatImage);

        return galleryValues;
      case 'float':
        //TODO: Find a more accurate representation of float
        return Number(item.value_double);
    }
  }
