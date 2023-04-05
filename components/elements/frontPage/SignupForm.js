import { useState, useCallback } from 'react'; 
import "cross-fetch/polyfill";
import cx from 'classnames';
import { backendPath } from '@klaudsol/commons/lib/GlobalConstants';
import { useLoginMode, LOGIN_MODE_LOGIN } from '@/components/contexts/LoginModeContext';
import styles from '@/styles/FrontPageLayout.module.scss';
import { slsFetch } from "@klaudsol/commons/lib/Client";

const SignupForm = ({className, ...props}) => {
  
  const [, setLoginMode] = useLoginMode();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [validated, setValidated] = useState(false);
  
  const onSubmit = useCallback((evt) => {
    evt.preventDefault();
    (async () => {
      
      setValidated(true); 
      if(email) { 
        try {
          const response = await slsFetch(backendPath('/add_to_waitlist'), {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({email: email })
          });
          if (response.status < 200 || response.status >= 299) throw new Error(`Response status: ${response.status}`);
        } catch(ex) {
          console.error(ex);  
          setIsError(true); 
        } finally {
          setSubmitted(true);
        }
      }
      
    })();
  }, [email]);
  
  return (
    
    <div className={cx("col-lg-5 col-sm-12 col-xs-12 mb-4 container-with-transition", className)} {...props}>
      <div className={cx("banner-form", styles['banner-form'])} id="signup-form">
        <form> 
        
        {!submitted && !isError &&
          <div className="alert alert-info">
            <p>
              Thanks for your interest in SME!  
            </p>
            <p>
            We are in <strong><em>private beta</em></strong>, and we&apos;ll be gradually expanding access over the coming weeks. 
            </p>
            <p>
              Submit this form to  <strong><em>join the waitlist</em></strong> and we&apos;ll email you an invite when we&apos;re ready for you to join.
            </p>
          </div>
        }
        
        {submitted && !isError &&
          <div className="alert alert-success">
            <p>You have been successfully added to our waitlist!</p>
          </div>
        }
        
        {isError && 
          <div className="alert alert-danger">
            <p>Something unexpected happened. Please try submitting again.</p>
          </div>
        }
    
          {/*
          <% content_for :flash_message do%>
             <% if notice %>
              <div class="alert alert-warning"><%= notice %></div>
             <% end %>
    
             <% if alert %>
              <div class="alert alert-danger"><%= alert %></div>
             <% end %>
    
              <%= render 'shared/error_messages', object: f.object %>  
          <% end %>
          */}
    
          <div className={cx("form-group", styles['form-group'])}>
            <label>Email</label>
            <input type='email' autoComplete='email' 
              className={cx('form-control', styles['form-control'], {'is-invalid': validated && !email, [styles['is-invalid']]: validated && !email})} 
              placeholder='hello@klaudsol.com' onChange={(evt) => setEmail(evt.target.value) } />
          </div>
    
    
          {/*
    
          <div class="form-group">
            <label>Password</label>
            <input type='password' autoComplete='password' className='form-control' placeholder='Choose a hard-to-guess password.' />
          </div>
    
          <div id="user_subscriber_role_id_container" class="form-group">
            <label>I am a/an...</label>
            <select class='form-control'>
              <option>Investor</option>  
              <option>Broker / Agent</option>  
              <option>Flipper (Buy & Sell)</option>  
              <option>Others</option>  
            </select>
          </div>
    
          <div id="user_subscriber_role_others_container" class="form-group d-none">
            <label>I am a/an...</label>
            <input type='text' autoComplete='subscriber_role_others' className='form-control' placeholder='Please specify' />
          </div>
    
          <div class="form-check">
            <input type='checkbox' className='form-check-input' />
            <label className='form-check-label'>YES, receive exclusive updates on Doorbell and the foreclosed properties industry</label>
          </div>
    
          <button type="submit" class="btn btn-primary">Register Now</button>
          */}
          
          <button className={cx("btn", "btn-primary", styles['btn'], styles['btn-primary'])} onClick={onSubmit}>Please Add Me to Waitlist</button>
          <button className={cx('btn', 'btn-outline-primary', styles['btn'], styles['btn-outline-primary'])} onClick={(evt) => {evt.preventDefault(); setLoginMode(LOGIN_MODE_LOGIN)}}>Log in</button> 
          
          </form>
    
      </div>
    </div>

  );
  
};

export default SignupForm;
