//Consider moving this as @/lib/Util

import { useEffect, useMemo } from "react";
import { COMMUNICATION_LINKS_FAILURE, UNAUTHORIZED } from "@/lib/HttpStatuses";
import { TYPES_REGEX } from "@/components/renderers/validation/TypesRegex";
import { promisify } from "es6-promisify";
import crypto from "crypto";
import { operators } from "@/constants/index";

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

export const slsFetch = async (url, params, extra) => {
  const { retry = 0, unauthorized = null } = extra ?? {};
  const response = await fetch(url, params);
  if (response.status >= 200 && response.status <= 299) {
    return response;
  } else if (response.status === COMMUNICATION_LINKS_FAILURE) {
    if (retry >= 20) {
      throw new Error(`Exceeded retry limit: ${retry}`);
    } else {
      console.error("Contacting server...");
      return await new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve(slsFetch(url, params, { retry: retry + 1, unauthorized })),
          500 * Math.pow(2, retry - 1)
        );
      });
    }
  } else if (response.status === UNAUTHORIZED) {
    if (unauthorized) unauthorized();
    return null;
  } else {
    const responseJson = await response.json();

    if (responseJson.message) {
      //Frontend can parse response of backend
      throw new Error(responseJson.message);
    } else {
      throw new Error(`Response status: ${response.status}`);
    }
  }
};

export const generateRandVals = async (size) => {
  const randomBytes = promisify(crypto.randomBytes);
  const rawBytes = await randomBytes(size);
  const randVal = rawBytes.toString("hex");

  return randVal;
};

export const useIndex = (array) =>
  useMemo(
    () => Object.fromEntries(array.map((item) => [item.id, item])),
    [array]
  );

export const sortByOrderAsc = (first, second) =>
  first[1].order - second[1].order;

export const isNumber = (str) => {
  return !isNaN(str);
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
  const splitted = sortValue.split(':');
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
   
  if(order.toLowerCase() === 'desc'){
    sortedData = sortedData.reverse()
  }

  return sortedData
};

const substringSearch = (item) => {
  const values = item.match(/\((.*?)\)/)[1].split(", ");
  const converted = values
    .map((value) => `slug LIKE '%${value}%'`)
    .join(" OR ");
  return converted;
};

const valueTypesIterator = (operator, value, isSubstringSearch = false) => {
  const valueTypes = ["value_string", "value_long_string", "value_double"];
  const isNotCovertible = isNumber(value);

  const convertedValue = isNotCovertible ? value : `"${value}"`;
  const finalValue = isNotCovertible ? convertedValue : `(${convertedValue})`;

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

export const transformQuery = (queries) => {
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

  const transformCondition = (obj) => {
    // incomplete
    // for now, this function can only receive a single filter value.
    // refactor in future for multiple filter

      switch (obj.operator) {
        case "$contains":
        case "$notContains":
          return `(attributes.name = "${
            obj.identifier
          }" AND ${valueTypesIterator(
            operators[obj.operator],
            obj.value[0],
            true
          )})`;

        default:
          return `(attributes.name = "${
            obj.identifier
          }" AND ${valueTypesIterator(operators[obj.operator], obj.value[0])})`;
      }
    };
  
  const SQLconditions = transformCondition(formattedQueries[0]);

  return SQLconditions;
};
