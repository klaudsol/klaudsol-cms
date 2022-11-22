  export const resolveValue = (item) => {
    switch(item.attributes_type) {
      case 'text':
      case 'image':
      case 'link':
        return item.value_string;
      case 'textarea':
        return item.value_long_string;
      case 'float':
        //TODO: Find a more accurate representation of float
        return Number(item.value_double);
    }
  }