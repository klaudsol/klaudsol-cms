import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
  return (
    
  <>  
		<header id="header">
			<div className="startp-mobile-nav">
				<div className="logo">
				&nbsp;
				</div>
			</div>

			<div className="startp-nav">
				<div className="container">
					<nav className="navbar navbar-expand-lg navbar-light row">
            
              <div className="col-lg-4 col-md-6 col-sm-10 col-10"> 
                <div className='image-logo' >
                  <Image width="60" height="60" src='/sme-logo-no-border.png' style={{width: '60px', marginRight: '10px', position: 'relative', top: '20px'}} alt='SME Logo' />
                </div>
                <Link href='/' className='navbar-brand'>
                    <strong>SME</strong>
                </Link>
              </div>

        
              {/*
              <button className="col-2 navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation" 
                style={{padding: "4px 1px"}}>
                  <span className="navbar-toggler-icon"></span>
              </button>
              */}

              <div className="col-lg-8 col-sm-12 ml-auto">

                <div className="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
                  <ul className="navbar-nav nav ml-auto">
                  {/*<%= render "shared/dashboard_button" %>*/}
                  {/*<%= render "shared/subscription_button" %>*/}
                  {/*<%= render "shared/login_logout_signup_button" %>*/}
                  {/* <LoginLogoutSignupButton /> */}
                  </ul>
                </div>
              </div>
					</nav>
				</div> 
			</div>
		</header>
	</>

  );
  
}

export default NavBar;
