import styles from '@/styles/FrontPageLayout.module.scss';
import cx from 'classnames';

import { useState } from 'react';
import LoginModeContext, { LOGIN_MODE_LOGIN } from '@/components/contexts/LoginModeContext';

import NavBar from '@/components/elements/frontPage/NavBar';
import MainBanner from '@/components/elements/frontPage/MainBanner';

export default function FrontPage({children}) {
	
  const [loginMode, setLoginMode] = useState(LOGIN_MODE_LOGIN);
  
  return (
  
	<LoginModeContext.Provider value={[loginMode, setLoginMode]}>
	
	  <div className={cx('outer', 'frontpage', styles.frontpage)}>
	    {/*<%= render "shared/google_tags_body" %> --> */}
	    <NavBar />
	    {/*<!--<%= render "shared/flash_message" %>  */}
	
	
	
	    {/*<!-- START YIELD -->*/}
	    <MainBanner />
	    {/*<!-- END YIELD -->*/}
	
			{/*<!-- Start Footer Area --*/}
			<footer className={cx('footer-area', 'bg-f7fafd', styles['footer-area'], styles['bg-f7fafd'])}>
				<div className="container">
					<div className="row">
	
						<div className="col-lg-3 col-md-6 col-sm-12 mb-5">
							<div className={cx('single-footer-widget', styles['single-footer-widget'])}>
								<div className={cx('logo', styles.logo)}>
									<h3><a href="#top">SME</a></h3>
								</div>
								<p>Helping Filipino small and medium-sized businesses achieve more.</p>
							</div>
						</div>
	
						<div className="col-lg-3 col-md-6 col-sm-12 mb-5">
							<div className={cx('single-footer-widget',styles['single-footer-widget'])}>
								<h3>Company</h3>
								<ul className={cx('list', styles.list)}>
									<li><a href="https://klaudsol.com" target="_blank" rel="noreferrer">About KlaudSol</a></li>
								</ul>
							</div>
						</div>
	
						<div className="col-lg-3 col-md-6 col-sm-12 mb-5">
							<div className={cx('single-footer-widget', styles["single-footer-widget"])}>
								<h3>Support</h3>
								<ul className={cx('footer-contact-info', styles['footer-contact-info'])}>
									<li><i data-feather="message-circle"></i><a href="https://m.me/klaudsol" target="_blank" rel="noreferrer">Let&apos;s talk!</a></li>
								</ul>
							</div>
						</div>
	
						<div className="col-lg-3 col-md-6 col-sm-12">
							<div className={cx('single-footer-widget', styles['single-footer-widget'])}>
								<h3>Address</h3>
								
								<ul className={cx('footer-contact-info', styles['footer-contact-info'])}>
									<li><i data-feather="map-pin"></i> Level 10-01 One Global Place, 5th Avenue & 25th Street, Bonifacio Global City, Taguig, Metro Manila</li>
									<li><i data-feather="mail"></i> Email: <a href="mailto:hello@klaudsol.com" target="_blank" rel="noreferrer">hello@klaudsol.com</a></li>
									<li><i data-feather="phone-call"></i> Phone: <a href="#top">+ (632) 618 5109</a></li>
								</ul>
								
								
	{/*
	<%
	<<~COMMENT
	%>		
	              <!--
								<ul className="social-links">
									<li><a href="#" className="facebook"><i data-feather="facebook"></i></a></li>
									<li><a href="#" className="twitter"><i data-feather="twitter"></i></a></li>
									<li><a href="#" className="instagram"><i data-feather="instagram"></i></a></li>
									<li><a href="#" className="linkedin"><i data-feather="linkedin"></i></a></li>
								</ul>
	              -->
	<%
	COMMENT
	%>		
	*/}
							</div>
						</div>
	
						<div className="col-lg-12 col-md-12">
							<div className={cx('copyright-area', styles['copyright-area'])}>
								<p>Copyright @2019-2021 <a href="https://klaudsol.com" target="_blank" rel="noreferrer">KlaudSol Philippines, Inc.</a> All rights reserved</p>
							</div>
						</div>
					</div>
				</div>
	
	{/*
	<%
	<<~COMMENT
	%>		
	      <!--	
				<div className="shape1"><img src="<%=asset_path('startp/shape1.png')%>" alt="shape"></div>
				<div className="shape8 rotateme"><img src="<%=asset_path("startp/shape2.svg")%>" alt="shape"></div>
	      -->
	<%
	COMMENT
	%>		
	*/}
			</footer>
			{/*<!-- End Footer Area -->*/}
	
			<div className={cx('go-top', styles["go-top"])}><i data-feather="arrow-up"></i></div>
	
	      {/*<!-- Load Facebook SDK for JavaScript -->*/}
	    <div id="fb-root"></div>
	
	    {/*<!-- Your customer chat code -->*/}
	    <div className="fb-customerchat"
	      attribution="setup_tool"
	      page_id="2349846601744827">
	    </div>	
	
	
	  </div>
  </LoginModeContext.Provider>

    );
  
}
