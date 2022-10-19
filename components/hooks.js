import { useCallback, useContext } from 'react';
import RootContext from '@/components/contexts/RootContext';
import { useRouter} from 'next/router'; 
import { RESET_CLIENT_SESSION } from '@/components/reducers/actions';
  
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