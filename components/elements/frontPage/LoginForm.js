import { useState, useCallback, useRef, useReducer} from 'react'; 
import cx from 'classnames';
import { useLoginMode, LOGIN_MODE_SIGNUP } from '@/components/contexts/LoginModeContext';
import { useFadeEffect, slsFetch } from '@/components/Util'; 
import { useRouter } from 'next/router';
import styles from '@/styles/FrontPageLayout.module.scss';

const LoginForm = ({className, ...props}) => {
  const router = useRouter();
  const [, setLoginMode] = useLoginMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const initialState = {
    submitted: false,  
    isError: false,
    isLoading: false,
    isLoginSuccessful: false
  };
  
  const reducer = (state, action) => {
    switch(action.type) {
      case 'INIT':     
        return {
          ...state,
          isLoading: true,
          submitted: false
        };
      case 'SUCCESS':
        return {
          ...state,
          isLoginSuccessful: true,
          isError: false,
          submitted: true
        }
      case 'ERROR':
        return {
          ...state,
          isLoginSuccessful: false,
          isError: true,
          submitted: true
        }
      case 'CLEANUP':
        return {
          ...state,
          isLoading: false
        }
      default:
        return state;
    }
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const onSubmit = useCallback((evt) => {
    evt.preventDefault();
    (async () => {
        try {
          dispatch({type: 'INIT'});
          const response = await slsFetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
          const { message, homepage } = await response.json();
          dispatch({type: 'SUCCESS'});
          router.push(`/${homepage}`);
          
        } catch(ex) {
          console.error(ex);  
          dispatch({type: 'ERROR'});
        } finally {
          dispatch({type: 'CLEANUP'});
        }
      //}
    })();
  }, [email, password, router]);
  
  
  const errorBox = useRef();
  const successBox = useRef();
  
  useFadeEffect(errorBox, [state.submitted, state.isError]);
  useFadeEffect(successBox, [state.submitted, state.isLoginSuccessful]);
  
  
  return (
      <div className={cx("col-lg-5 col-sm-12 col-xs-12 mb-4 container-with-transition", className)} {...props}>
        <div className={styles["banner-form"]} id="login-form">
          <form> 
          
              <div ref={errorBox} className="alert alert-danger useFadeEffect">
                <p>Incorrect username and/or password.</p>
              </div>
            
              <div ref={successBox} className="alert alert-success useFadeEffect">
                <p>Welcome back! Logging you in...</p>
              </div>
              
              {/*state.submitted && state.isLoginSuccessful &&
                <Redirect to="/dashboard" />
              */}
            
            <div className={cx('form-group', styles["form-group"])}>
              <label>Email</label>
              <input type='email' className={cx('form-control', styles['form-control'])} autoComplete="email" onChange={evt => setEmail(evt.target.value)} />
            </div>
      
          
            <div className={styles["form-group"]}>
              <label>Password</label>
              <input type='password' className={cx('form-control', styles['form-control'])} autoComplete="current-password" onChange={evt => setPassword(evt.target.value)} />
            </div>
      
      
            <button className={cx(styles['btn'], styles['btn-primary'])} onClick={onSubmit}>
              {state.isLoading &&
                <span>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  &nbsp;
                </span>
              }
              Log in
            </button> 
            <button className={cx('btn', 'btn-outline-primary', styles['btn'], styles['btn-outline-primary'])} onClick={(evt) => {evt.preventDefault(); setLoginMode(LOGIN_MODE_SIGNUP)}}>Sign up</button> 
          </form>
        </div>
      </div>
  );
  
};

export default LoginForm;