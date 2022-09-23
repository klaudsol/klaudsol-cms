import styles from '@/styles/FrontPageLayout.module.scss';
import cx from 'classnames';

import { useState } from 'react';
import LoginModeContext, { LOGIN_MODE_LOGIN } from '@/components/contexts/LoginModeContext';

import NavBar from '@/components/elements/frontPage/NavBar';
import MainBanner from '@/components/elements/frontPage/MainBanner';
import LoginForm from '@/components/elements/frontPage/LoginForm';


export default function FrontPage({children}) {
	
  const [loginMode, setLoginMode] = useState(LOGIN_MODE_LOGIN);
  
  return (
	<div className='container_main_bg'>
		<div className='container'>
			<div className='row'>
				<LoginForm/>
			</div>
		</div>
	 
	</div>
	
    );
  
}
