  export const resolveValue = (item) => {
    switch(item.attributes_type) {
      case 'text':
      case 'link':
        return item.value_string;
      case 'textarea':
        return item.value_long_string;
      case 'image':
        const bucketBaseUrl = process.env.AWS_S3_BASE_URL;

        const key = item.value_string;
        const name = key.substring(key.indexOf('_') + 1);
        const link = `${bucketBaseUrl}/`

        return { name, key, link };
      case 'float':
        //TODO: Find a more accurate representation of float
        return Number(item.value_double);
    }
  }
