//Consider moving this as @/lib/Util

import { useEffect, useMemo } from 'react'; 
import { COMMUNICATION_LINKS_FAILURE, UNAUTHORIZED } from '@/lib/HttpStatuses';

export const useFadeEffect = (ref, deps) => {
    
  useEffect(() => {
    
    let timeout; 
    if(deps.every((x) => !!x)) {
      
      ref.current.style.display = 'block';
      timeout = setTimeout(() => ref.current.style.opacity = 1, 50);
      
    } else {
      
      ref.current.style.opacity = 0;
      timeout = setTimeout(() => ref.current.style.display = 'none', 50);
      
    }
    
    return () => {
      if(timeout) {
        clearTimeout(timeout);  
      }
    };
  // eslint-disable-next-line   
  }, deps);
  
}


export const slsFetch = async (url, params, extra) => {
  
    const {retry = 0, unauthorized = null} = extra ?? {};
    const response = await fetch(url, params);
    if (response.status >= 200 && response.status <= 299) {
      return response;
    } else if (response.status === COMMUNICATION_LINKS_FAILURE) {
      if (retry >= 20) {
        throw new Error(`Exceeded retry limit: ${retry}`);  
      } else {
        console.error("Contacting server...");
        return await new Promise((resolve, reject) => {
          setTimeout(() => resolve(slsFetch(url, params, {retry: retry + 1, unauthorized})), 500 * (Math.pow(2, retry - 1)));  
        });
      }
    } else if (response.status === UNAUTHORIZED) {  
      if (unauthorized) unauthorized(); 
      return null;
    } else {
      const responseJson = await response.json();

      if(responseJson.message) {
        //Frontend can parse response of backend
        throw new Error(responseJson.message);
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    }
}  


export const useIndex = (array) => useMemo(() => (
    Object.fromEntries(array.map((item) => [item.id, item]))
  ),[array]);

export const sortByOrderAsc = (first, second) => first[1].order - second[1].order; 

export const isNumber = (str) => {
  return !isNaN(str);
}

export const findContentTypeName = (arr,slugName) => (
  arr.find((obj)=> (
    obj.entity_type_slug === slugName 
  ))
 )
  
const filterQuery = (queries) => (
  Object.entries(queries)
   .filter(([key, value]) => key.startsWith('filters'))
   .reduce((obj, [key, value]) => {
     const newKey = key.replace('filters','');
    return {...obj, [newKey]: !Array.isArray(value) ? [isNumber(value) ? Number(value) : value] : 
      convertToNumber(value).length ? convertToNumber(value) : value }
     }
     , {})
 )

 const formatQuery = (data) => (
  Object.entries(data).map(([key, value]) => {
    const [, identifier, operator] = key.split('[').map(i => i.replace(']', ''));
    return {
      value,
      operator,
      identifier
    };
  })
 )
  
const convertToNumber = items => {
  const converted = items.map(item => Number(item));
  return converted.includes(NaN) ? false : converted;
}; 

const isGreaterThan = (condition,value,orEqual=false) =>{
  const final = condition.map((eachCon)=>{
   return orEqual ? eachCon < value ? true : false : eachCon <= value ? true : false 
})
  return final.every(item => item === true);
}

export const filterData = (queries,Datas) => {
 
   const filteredQueries = filterQuery(queries);

  // filterQuery 
  // the function filters out the object and only return property that starts with 'filters'.
  // check if the value is only containing numbers, convert to number if true. 
  // NOTE: THIS IS TEMPORARY!! for now, we can only access the api through web URL 
  // in which all values are expected to be string. and so this will allow you to test and filter numbers such as ids, prices etc.  
  // frontend value is expected to be handled by JSQ library in the future

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
   //          {values:['pizza',potato'], operator:'$eq', identifier:'slug'},
   //          {values:['4000'], operator:'$lt', identifier:'price'},
   //         ]
   
    const filteredData = (item1, item2) => {
      return item2.filter(item => {
        return item1.every((obj,index) => {
    
          switch (obj.operator) {
            case '$eq':
                 return obj.value.includes(item[obj.identifier]);
            case '$eqi':
                 return obj.value.map((str)=>(str.toLowerCase())).includes(item[obj.identifier].toLowerCase());
            case '$ne':
                 return !obj.value.includes(item[obj.identifier]);
            case '$lt':
                 return !isGreaterThan(obj.value,item[obj.identifier]);
            case '$lte':  
                 return !isGreaterThan(obj.value,item[obj.identifier],true)
            case '$gt': 
                 return isGreaterThan(obj.value,item[obj.identifier]);
            case '$gte': 
                 return isGreaterThan(obj.value,item[obj.identifier],true);
            default:
              // incomplete 
          }
        });
      });
    };    
    
  return filteredData(formattedQueries,Datas)  

}