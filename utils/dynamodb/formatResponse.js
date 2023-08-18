// Formats image to its correct form 

import { DYNAMO_DB_ATTRIBUTE_TYPES, DYNAMO_DB_ID_SEPARATOR, DYNAMO_DB_TYPES } from "@/constants";

// returns an object { key, name, link }
export const formatImage = (image) => {
  const imageUrl = process.env.KS_S3_BASE_URL;
  let originalName = '';
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

// Formats the attribute value based on the attribute type
export const formatAttributeValue = (attribute) => {
  if (attribute.type === DYNAMO_DB_ATTRIBUTE_TYPES.text || 
      attribute.type === DYNAMO_DB_ATTRIBUTE_TYPES.textarea ||
      attribute.type === DYNAMO_DB_ATTRIBUTE_TYPES.link) {
    return attribute.value;
  } else if (attribute.type === DYNAMO_DB_ATTRIBUTE_TYPES.image) {
    return formatImage(attribute.value);
  } else {
    return parseInt(attribute.value);
  }
}

// Formats the attributes needed to correctly mapping the contents
export const getAttributeMap = (data) => {
  return data.Items
  .filter(item => item.type.S === DYNAMO_DB_TYPES.attribute)
  .reduce((result, item) => {
    const attributeId = item.SK.S;
    const attributeName = item.attributes.M.name.S;
    const attributeType = item.attributes.M.type.S;
    const attributeOrder = item.attributes.M.order.N;

    result[attributeId] = {
      name: attributeName,
      type: attributeType,
      order: parseInt(attributeOrder),
    };

    return result;
  }, {});
}

// Formats the 
export const formatContentData = (data, attributeMap) => {
  const items = data.Items;

  const content = items
  .filter(item => item.type.S === DYNAMO_DB_TYPES.content)
  .reduce((result, item) => {
    const itemKeyParts = item.SK.S.split(DYNAMO_DB_ID_SEPARATOR);
    const itemKey = itemKeyParts[1]; // get only the ulid
    result[itemKey] = {
      id: itemKey,
      slug: item.slug.S,
      status: item.status.S,
    };

    // checks if the content item has attributes
    if (item.attributes) {
      const formattedAttributes = Object.keys(item.attributes.M).reduce((formattedAttrs, attrKey) => {
        const attributeName = attributeMap[attrKey]?.name;

        if (attributeName) {
          const attributeValue = item.attributes.M[attrKey].S;
          formattedAttrs[attributeName] = {
            value: attributeValue,
            type: attributeMap[attrKey].type,
            order: attributeMap[attrKey].order
          };
        }
        
        return formattedAttrs;
      }, {});

      const sortedAttributes = Object
        .keys(formattedAttributes)
        .sort((a, b) => formattedAttributes[a].order - formattedAttributes[b].order)
        .reduce((sorted, attributeName) => {
          sorted[attributeName] = formatAttributeValue(formattedAttributes[attributeName]); 
          return sorted;
        }, {});

      result[itemKey] = {
        ...result[itemKey],
        ...sortedAttributes,
      };
    }

    return result;
  }, {});

  return content;
}

// Formats the attributes 
export const formatAttributesData = (data) => {
  const items = data.Items;
  const attributes = items
    .filter(item => item.type.S === DYNAMO_DB_TYPES.attribute)
    .reduce((result, item) => {
      const attributeName = item.attributes.M.name.S;
      const attributeType = item.attributes.M.type.S;
      const attributeOrder = item.attributes.M.order.N;
      
      result[attributeName] = {
        type: attributeType,
        order: parseInt(attributeOrder),
      };
      
      return result;
    }, {});
  
  // Sorts by order
  const sortedAttributes = Object
    .keys(attributes)
    .sort((a, b) => attributes[a].order - attributes[b].order)
    .reduce((sortedResult, attributeName) => {
      sortedResult[attributeName] = attributes[attributeName];
      return sortedResult;
    }, {});
  
  return sortedAttributes;
}

// Gets the variant of the content type (collection or singleton)
export const getEntityVariant = (data) => {
  return data.Items.filter(item => item.type.S === DYNAMO_DB_TYPES.content_type).map(x => x.variant.S)[0];
}


