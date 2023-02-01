  export const resolveValue = (item) => {
    switch(item.attributes_type) {
      case 'text':
      case 'link':
        return item.value_string;
      case 'textarea':
        return item.value_long_string;
      case 'image':
        if(!item.value_string) return;
        const bucketBaseUrl = process.env.AWS_S3_BASE_URL;

        const link = `${bucketBaseUrl}/`

        return { name: item.value_string, link };
      case 'float':
        //TODO: Find a more accurate representation of float
        return Number(item.value_double);
    }
  }
