import { useCallback } from 'react';
import { useLoginMode, LOGIN_MODE_LOGIN, LOGIN_MODE_SIGNUP, LOGIN_MODE_IN_SESSION } from './Context/LoginModeContext';

const LoginLogoutSignupButton = () => {
  
  const [loginMode, setLoginMode] = useLoginMode();
  
  const Button = useCallback(() => {
    
    switch(loginMode) {
      //this button is the reverse of the current login mode
      //If the login mode is to login, then the button must show  a way to navigate to sign up.
      case LOGIN_MODE_SIGNUP:
        return <button className='btn btn-primary container-with-transition' onClick={() => setLoginMode(LOGIN_MODE_LOGIN)}>Login</button>;
      case LOGIN_MODE_IN_SESSION:
        return <button className='btn btn-primary container-with-transition'>Logout</button>;
      case LOGIN_MODE_LOGIN:
        return <button className='btn btn-primary container-with-transition' onClick={() => setLoginMode(LOGIN_MODE_SIGNUP)}>Sign Up</button>;
      default:
        throw new Error(`Invalid mode: ${loginMode}`);
    }
    
  }, [loginMode, setLoginMode]);
  
  return(
    <li className="nav-item">
      <Button />
    </li>
  );
  
};

export default LoginLogoutSignupButton;