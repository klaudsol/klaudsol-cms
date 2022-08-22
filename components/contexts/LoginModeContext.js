import React, { useContext } from 'react';

const LoginModeContext = React.createContext(['', () => {}]);  

export const useLoginMode = () => useContext(LoginModeContext);

export const LOGIN_MODE_LOGIN = 'LOGIN_MODE_LOGIN';
export const LOGIN_MODE_SIGNUP = 'LOGIN_MODE_SIGNUP';
export const LOGIN_MODE_IN_SESSION = 'LOGIN_MODE_IN_SESSION';

export default LoginModeContext;