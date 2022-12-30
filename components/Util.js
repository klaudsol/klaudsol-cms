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
  


