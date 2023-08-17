// Formats image to its correct form 
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

export const getAttributeValue = (attribute) => {
  if (attribute.type === 'text' || 
      attribute.type === 'textarea' ||
      attribute.type === 'link') {
    return attribute.value;
  } else if (attribute.type === 'image') {
    return formatImage(attribute.value);
  } else {
    return parseInt(attribute.value);
  }
}

export const getAttributeMap = (data) => {
  return data
  .filter(item => item.type.S === 'attribute')
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

export const getContent = (data) => {
  const items = data.Items;
  const attributeMap = getAttributeMap(items);

  const content = items
  .filter(item => item.type.S === 'content')
  .reduce((result, item) => {
    const itemKeyParts = item.SK.S.split("#");
    const itemKey = itemKeyParts[1]; // get only the ulid
    result[itemKey] = {
      id: itemKey,
      slug: item.slug.S,
      type: item.type.S,
      status: item.status.S,
    };

    // checks if the content item has attributes
    if (item.attributes) {
      const formattedAttributes = Object.keys(item.attributes.M).reduce((formattedAttrs, attrKey) => {
        const attributeName = attributeMap[attrKey]?.name;

        if (attributeName) {
          const attributeValue = item.attributes.M[attrKey].S; // Directly access the attribute value
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
          sorted[attributeName] = getAttributeValue(formattedAttributes[attributeName]); 
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

export const getAttributes = (data) => {
  const items = data.Items;
  const attributes = items
    .filter(item => item.type.S === 'attribute')
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
  
  const sortedAttributes = Object
    .keys(attributes)
    .sort((a, b) => attributes[a].order - attributes[b].order)
    .reduce((sortedResult, attributeName) => {
      sortedResult[attributeName] = attributes[attributeName];
      return sortedResult;
    }, {});
  
  return sortedAttributes;
}

export const getContentLength = (data) => {
  return data.Items.filter(item => item.type.S === 'content').map(x => x).length;
}

export const getEntityVariant = (data) => {
  return data.Items.filter(item => item.type.S === 'content_type').map(x => x.variant.S)[0];
}


