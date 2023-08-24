import { 
  DYNAMO_DB_ATTRIBUTE_TYPES, 
  DYNAMO_DB_ORDER, 
  DYNAMO_DB_TYPES 
} from "@/constants";

/** 
 * RESPONSE FORMATTER 
 * */

// # 1: DATA FORMATTER
// Formats rawEntityTypeSlug response
// This function will only return the values that are included in the attributes of the content_type
// This function automatically formats the value based on its type
export const formatEntityTypeSlugResponse = (data, attributeMetadata) => {
  return data.Items?.reduce((result, item) => {
    const itemKey = item.id.S;

    const defaultItems = {
      id: itemKey,
      slug: item.slug.S,
      status: item.status.S,
    };

    if (item.values) {
      const values = Object.keys(item.values.M).reduce((updatedAttrs, attributeName) => {
        if (attributeMetadata[attributeName]) {
          const attribute = item.values.M[attributeName];
          const attributeType = attributeMetadata[attributeName].type;

          // formats the value based on type
          updatedAttrs[attributeName] = formatValueByType(attributeType, attribute[Object.keys(attribute)[0]]);
        }

        return updatedAttrs;
      }, {});

      result[itemKey] = {
        ...defaultItems,
        ...values,
      };

    } else {
      result[itemKey] = defaultItems;
    }

    return result;
  }, {});
};

// # 2: ATTRIBUTES FORMATTER
// Formats the attributes from the content_type
// Usese the formatAttributeMap function to map the attributes correctly
export const formatAttributesData = (data) => {
  const attributes = data
    .reduce((result, item) => {
      if (item.attributes) {
        const attributesMap = item.attributes.M;
        result = formatAttributeMap(attributesMap);
      }
      return result;
    }, {});
  
  return attributes;
}

/** 
 * ATTRIBUTE TYPE FORMATTER 
 * */

// # 1: IMAGE ATTRIBUTE TYPE FORMATTER
// Formats image to its correct form 
// returns an object { key, name, link }
// This is based on how images are originally formatted in KlaudSol CMS
export const formatImage = (image) => {
  const imageUrl = process.env.KS_S3_BASE_URL;
  let originalName = '';
  /* this is how we generate the uniqueKey (file name of image / video). 
   * The key is the actual file name of the uploaded image (e.g. geli.png). 
   * It will be appended by a random value separated by a comma. As a result, 
   * the file name uploaded to the s3 and saved to the database follows this format. (e.g. 0xlofisl_geli.png);
   */

  if (image.includes("_")) {
    originalName = image.split("_")[1];
  } else {
    originalName = image;
  }
  return {
    key: image,
    name: originalName,
    link: `${imageUrl}/${image}`,
  }
}

// # 2: MAP ATTRIBUTE TYPE FORMATTER
// Formats map attribute types
export const formatMapAttribute = (mapData) => {
  return Object.keys(mapData).reduce((formattedMap, key) => {
    const mapAttributeValue = mapData[key];
    const mapAttributeType = Object.keys(mapAttributeValue)[0];
    formattedMap[key] = mapAttributeValue[mapAttributeType];
    return formattedMap;
  }, {});
};

/** 
 * VALUE FORMATTERS 
 * */

// # 1: VALUE FORMATTER BY TYPE
// Formats value based on type
// Checks the type and returns the expected output
const formatValueByType = (attributeType, attributeValue) => {
  switch (attributeType) {
    case DYNAMO_DB_ATTRIBUTE_TYPES.image:
      return formatImage(attributeValue);
    case DYNAMO_DB_ATTRIBUTE_TYPES.integer:
      return parseInt(attributeValue);
    case DYNAMO_DB_ATTRIBUTE_TYPES.double:
      return parseFloat(attributeValue);
    case DYNAMO_DB_ATTRIBUTE_TYPES.map:
      if (typeof attributeValue === 'object') {
        return formatMapAttribute(attributeValue);
      }
      break;
    default:
      return attributeValue;
  }
};

// # 2: MAP FORMATTER
// Formats mapped objects 
// attributes with M (map) properly returns a mapped object
// attributes with N (number) properly returns a number
// default is string
export const formatAttributeMap = (attributeMap) => {
  return Object.keys(attributeMap).reduce((remapped, key) => {
    if (attributeMap[key].M) {
      remapped[key] = formatAttributeMap(attributeMap[key].M);
    } else if (attributeMap[key].N) {
      remapped[key] = parseInt(attributeMap[key][Object.keys(attributeMap[key])[0]]);
    } else {
      remapped[key] = attributeMap[key][Object.keys(attributeMap[key])[0]];
    }
    return remapped;
  }, {});
}

// # 3: ENTITY VARIANT FORMATTER
// Gets the variant of the content type (collection or singleton)
export const getEntityVariant = (data) => {
  return data.Items
    .filter(item => item.type.S === DYNAMO_DB_TYPES.content_type)
    .map(x => x.variant.S)[0];
}

// # 4: ITEMS ORDER 
// Gets the order of the items
// Default order is descending
export const getOrder = (order) => {
  let scanIndexForward = false;
  if (order === DYNAMO_DB_ORDER.asc) {
    scanIndexForward = true;
  } 
  return scanIndexForward;
}

export const getOrganizationPK = (organization_slug) => {
  return `organization#${organization_slug}`;
}

export const getContentTypePK = (contentTypeSlug) => {
  return `content_type#${contentTypeSlug}`;
}

export const getContentPK = (contentTypeSlug, contentSlug) => {
  return `content#${contentTypeSlug}/${contentSlug}`;
}