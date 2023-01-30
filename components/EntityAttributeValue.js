  export const resolveValue = (item) => {
    console.log(item);
    switch(item.attributes_type) {
      case 'text':
      case 'image':
        return { originalName: item.value_string, name: item.images_name, link: item.images_link }
      case 'link':
        return item.value_string;
      case 'textarea':
        return item.value_long_string;
      case 'float':
        //TODO: Find a more accurate representation of float
        return Number(item.value_double);
    }
  }
