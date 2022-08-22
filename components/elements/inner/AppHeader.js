import {
  CContainer,
  CHeader,
  CHeaderBrand,
  //CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  //CNavLink,
  //CNavItem,
  CImage
} from '@coreui/react';
import CacheContext from '@/components/contexts/CacheContext';
import { useContext, useEffect } from 'react';


//import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
//import { logo } from '../assets/brand/logo'

const AppHeader = () => {
  
  const cache = useContext(CacheContext);
  const { firstName = null } = cache ?? {};
  

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          //onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          {/*<CIcon icon={cilMenu} size="lg" />*/}
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/*<CIcon icon={logo} height={48} alt="Logo" />*/}
          <CImage src='/sme-logo-no-border.png' width={35} align='start' className='mobile-logo'/>&nbsp;
          <h1 className='mobile-title'>SME</h1>
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          {/*
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink} activeClassName="active">
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
          */}
        </CHeaderNav>
        <CHeaderNav>
        {/*
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
          */}
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          { firstName &&
           <span className='welcome-user d-none d-md-inline'>Welcome, {firstName}</span>
          }
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/*<CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>*/}
    </CHeader>
  )
}

export default AppHeader
