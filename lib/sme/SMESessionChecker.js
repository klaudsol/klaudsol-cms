import { useEffect, useReducer } from 'react'
import { slsFetch } from '@klaudsol/commons/lib/Client';
import { backendPath } from '@klaudsol/commons/lib/GlobalConstants';

const SMESessionChecker = ({children}) => {
  
  const initialState = {
    loading: true,
    success: false
  }
  
  const reducer = (state, action) => {
    
    switch (action.type) {
      
      case 'STARTED_LOADING':
        return {
          ...state,
          loading: true,
          success: false
        }
      case 'LOADED':
        return {
          ...state,
          loading: false,
          success: true
        }
      default:
        return state;
    }
    
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const {loading} = state;
  
  useEffect(() => {
    (async () => {
      
      dispatch({type: 'STARTED_LOADING'});
      
      try {
        const response =  await slsFetch(backendPath('/session'));
        const responseJson = await response.json();
        console.log(responseJson);
        dispatch({type: 'LOADED'});
      } catch {
        window.location.href = '/';
      } 
      
    })();
    
  }, []);
  
  
  
  return children(loading); 
  
}

export default SMESessionChecker;