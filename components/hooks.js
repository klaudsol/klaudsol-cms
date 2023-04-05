import { useCallback, useContext } from 'react';
import RootContext from '@/components/contexts/RootContext';
import CacheContext from '@/components/contexts/CacheContext';
import { useRouter} from 'next/router'; 
import { RESET_CLIENT_SESSION, SET_IS_TOKEN_EXPIRED } from '@/lib/actions';

export const useLogout = () => {
  const {state, dispatch} = useContext(RootContext);
  const router = useRouter();
 
  const logout = useCallback(() => {
    //Kick out of the session there is no session from API
    dispatch({type: RESET_CLIENT_SESSION});  
    router.push('/');   
  }, [dispatch, router]);
  
  return logout;
};

export const useCapabilities = () => {
  const cache = useContext(CacheContext);
  return cache?.capabilities ?? [];
};

export const useClientErrorHandler = () => {
  const { state, dispatch } = useContext(RootContext);

  return (err) => {
      console.error(err);

      // The errors come from the response of the server,
      // so we can't really use Error classes here
      if(err.message === 'Token expired. Please log in again.') {
        dispatch({ type: SET_IS_TOKEN_EXPIRED, payload: true });
      }
  }
}
