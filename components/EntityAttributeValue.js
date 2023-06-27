import { plugin } from "@/components/plugin/plugin";

const formatImage = (key) => {
    if (!key) return;

    const bucketBaseUrl = process.env.KS_S3_BASE_URL;

    const name = key.substring(key.indexOf('_') + 1);
    const keyForLink = key.split(' ').join('+');
    const link = `${bucketBaseUrl}/${keyForLink}`

    return { name, key, link }
}

  export const resolveValue = (item) => {
    switch(item.attributes_type) {
      case 'text':
      case 'link':
        return item.value_string;
      case 'boolean':
        return item.value_boolean;
      case 'textarea':
        return item.value_long_string;
      case 'rich-text':
        return item.value_long_string;
      case 'image':
        if(!item.value_string) return;
        const imageValues = formatImage(item.value_string);
        
        return imageValues;
      case 'video':
        if(!item.value_string) return;
        const videoValues = formatImage(item.value_string);
        return videoValues;
      case 'gallery':
        if(!item.value_long_string) return [];

        const galleryValuesRaw = JSON.parse(item.value_long_string);
        const galleryValues = galleryValuesRaw.map((item) => formatImage(item));

        return galleryValues;
      case 'float':
        //TODO: Find a more accurate representation of float
        return Number(item.value_double);
      //added for datetime
      case 'date-time':
        return item.value_string;;

      case 'custom':
        const CustomAttributeType = plugin(item.attributes_custom_name);
        const customAttributeType = new CustomAttributeType({
          data: item.value_long_string, 
          metadata: {
            type: 'custom',
            custom_name: item.attributes_custom_name,
            id: item.id
          }
        });

        
        return customAttributeType.toApi();
    }
  }
