import cx from 'classnames';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useLoginMode, LOGIN_MODE_LOGIN, LOGIN_MODE_SIGNUP } from '@/components/contexts/LoginModeContext';
import styles from '@/styles/FrontPageLayout.module.scss';

const MainBanner = () => {
  
  const [loginMode] = useLoginMode();
  
  return (
    <>
   		{/*<!-- Start Main Banner -->*/}
  		<div className={cx('main-banner', styles["main-banner"])}>
  					<div className="container">
  
  						<div className="row form-container">
  						
                <LoginForm className={cx({
                'd-none': loginMode !== LOGIN_MODE_LOGIN,
                'd-block': loginMode === LOGIN_MODE_LOGIN
                })}/>
               
                <SignupForm className={cx({
                  'd-none': loginMode !== LOGIN_MODE_SIGNUP,
                  'd-block': loginMode === LOGIN_MODE_SIGNUP,
                })}  />
                  
  							<div className="col-lg-6 col-sm-12 mt-lg-5">
  							  {/*
  								<div className="hero-content">
  									<h1>Get SMS Alerts for NEW Foreclosed Home Deals!</h1>
  									<p>Are you a real estate investor in the <strong>Philippines</strong>? Get that first-to-know advantage. 
                      Be informed when a recently foreclosed home investment opportunity comes up. 
                      Fresh deals straight to your mobile phone.</p>
  									
  								</div>
  								*/}
  							</div>
  
  
  						</div>
  					</div>
  		</div>
  		{/*<!-- End Main Banner -->*/}
  
  
      
    </>
  );
  
};

export default MainBanner