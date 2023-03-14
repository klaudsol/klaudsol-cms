//Consider moving this as @/lib/Util

import { useEffect, useMemo } from "react";
import { COMMUNICATION_LINKS_FAILURE, UNAUTHORIZED } from "@klaudsol/commons/lib/HttpStatuses";
import { TYPES_REGEX } from "@/components/renderers/validation/TypesRegex";
import { promisify } from "es6-promisify";
import crypto from "crypto";
import { operators } from "@/constants/index";
import { resourceValueTypes } from "@/components/cmsTypes";

export const useFadeEffect = (ref, deps) => {
  useEffect(() => {
    let timeout;
    if (deps.every((x) => !!x)) {
      ref.current.style.display = "block";
      timeout = setTimeout(() => (ref.current.style.opacity = 1), 50);
    } else {
      ref.current.style.opacity = 0;
      timeout = setTimeout(() => (ref.current.style.display = "none"), 50);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line
  }, deps);
};




export const useIndex = (array) =>
  useMemo(
    () => Object.fromEntries(array.map((item) => [item.id, item])),
    [array]
  );

export const sortByOrderAsc = (first, second) =>
  first[1].order - second[1].order;

export const isNumber = (str) => {
  return !isNaN(str) && str !== '';
};

export const resolveResource = (rsc) => {
  if (!rsc) return [];

  if (TYPES_REGEX.IMAGE.test(rsc.value)) {
    const bucketBaseUrl = process.env.KS_S3_BASE_URL;
    const imageURL = `${bucketBaseUrl}/${rsc.value}`;

    return { ...rsc, link: imageURL };
  } else {
    return rsc;
  }
};

export const findContentTypeName = (arr, slugName) =>
  arr.find((obj) => obj.entity_type_slug === slugName);

const filterQuery = (queries) =>
  Object.entries(queries)
    .filter(([key, value]) => key.startsWith("filters"))
    .reduce((obj, [key, value]) => {
      const newKey = key.replace("filters", "");
      return {
        ...obj,
        [newKey]: !Array.isArray(value)
          ? [isNumber(value) ? Number(value) : value]
          : convertToNumber(value).length
          ? convertToNumber(value)
          : value,
      };
    }, {});

const formatQuery = (data) =>
  Object.entries(data).map(([key, value]) => {
    const [, identifier, operator] = key
      .split("[")
      .map((i) => i.replace("]", ""));
    return {
      value,
      operator,
      identifier,
    };
  });

const convertToNumber = (items) => {
  const converted = items.map((item) => Number(item));
  return converted.includes(NaN) ? false : converted;
};

export const sortData = (data, sortValue) => {
  console.log(data);
  
  const splitted = sortValue.split(":");
  const [identifier, order] = splitted;

  let sortedData = Object.values(data).sort((a, b) => {
    if (a[identifier] < b[identifier]) {
      return -1;
    }
    if (a[identifier] > b[identifier]) {
      return 1;
    }
    return 0;
  });

  if (order?.toLowerCase() === "desc") {
    sortedData = sortedData.reverse();
  }

  return sortedData;
};

const valueTypesIterator = (operator, value, isSubstringSearch = false, isEqualOperator = false ) => {
  const valueTypes = ["value_string", "value_long_string", "value_double"];
  const isNotCovertible = isNumber(value);

  const convertedValue = isNotCovertible ? value : `"${value}"`;
  const finalValue = isNotCovertible && !isEqualOperator ? convertedValue : `(${convertedValue})`;
 
  let combinedValues;
  if (!isNotCovertible) {
    combinedValues = valueTypes.map((columnName, index) => {
      return `${columnName} ${operator} ${
        !isSubstringSearch ? `${finalValue}` : `"%${value}%"`
      }${valueTypes.length != index + 1 ? " OR" : ""}`;
    });
  } else {
    combinedValues = `value_double ${operator} ${
      !isSubstringSearch ? `${finalValue}` : `"%${value}%"`
    }`;
    // only return long_double
  }

  return isNotCovertible ? combinedValues : `${combinedValues.join(" ")}`;
};

const transformConditions = (arr) => {
  const transformedConditions = arr.map((obj) => {
    const typeFinder = `(attributes.name = "${obj.identifier}")`;
    switch (obj.operator) {
      case "$contains":
      case "$notContains":
        return `${typeFinder} AND (${valueTypesIterator(
          operators[obj.operator],
          obj.value[0],
          true
        )})`;
      case "$eq":

        return `${typeFinder} AND (${valueTypesIterator(
          operators[obj.operator],
          obj.value[0],
          false,
          true
        )})`;

      default:
        return `${typeFinder} AND (${valueTypesIterator(
          operators[obj.operator],
          obj.value[0]
        )})`;
    }
  });
  return transformedConditions;
};

const areAllIdentifiersEqual = (item) => {
  const identifiers = item.map(obj => obj.identifier); 
  return identifiers.every(id => id === identifiers[0]); 
} // for future uses of AND/OR filter condition

const combineSQL = (conditionArray, entity_type_slug) => {

  const subqueries = conditionArray.map((condition, index) => {
    const tableAlias = `t${index + 1}`;
    return `(SELECT entities.id
              FROM entities
              LEFT JOIN entity_types ON entities.entity_type_id = entity_types.id
              LEFT JOIN attributes ON attributes.entity_type_id = entity_types.id
              LEFT JOIN \`values\` ON values.entity_id = entities.id AND values.attribute_id = attributes.id
              WHERE entity_types.slug = "${entity_type_slug}" AND ${condition}) ${tableAlias}`;
  });

  const intersect = subqueries.map((_, index) => {
    return `INNER JOIN ${subqueries[index]} ON e1.id = t${index + 1}.id`;
  }).join('\n');

  return `SELECT DISTINCT e1.id
          FROM entities e1
          ${intersect}`;
}


export const generateSQL = (queries, entity_type_slug) => {
   
  const filteredQueries = filterQuery(queries);
  
  // Originally, values are only nested when it detects multiple values with the same operator type,
  // However, In our case, we are forcing all values to be nested in an array.
  // also, remove the filters keyword from the property name when returned

  // input:  { 'filters[slug][$eq]': ['pizza','potato'],filters[price][$lt]:'4000', entity_type_slug: 'menus' }
  // output: { '[slug][$eq]': ['pizza','potato'], '[price][$lt]':[4000]}

  const formattedQueries = formatQuery(filteredQueries);

  // formatQuery
  // The function converts a single object containing all filtered values into an array of objects,
  // where the types of operators are divided into separate objects.
  // input:  { '[slug][$eq]': ['pizza','potato'], '[price][$lt]':[4000]}
  // output: [
  //          {value:['pizza',potato'], operator:'$eq', identifier:'slug'},
  //          {value:['4000'], operator:'$lt', identifier:'price'},
  //         ]
  const SQLconditions = transformConditions(formattedQueries);
  let combinedSQL
  if(SQLconditions.length){
     combinedSQL = combineSQL(SQLconditions, entity_type_slug);
  }
  return SQLconditions.length ? combinedSQL : null
};
