import React,{ useState, useRef, useContext } from 'react';
import { 
    CSidebar, 
    CSidebarBrand, 
    CSidebarFooter, 
    CSidebarNav,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownItemPlain,
    CDropdownDivider
} from '@coreui/react'
import { 
    FaFeatherAlt,
    FaBuilding,
    FaPlus,
    FaChevronRight,
    FaChevronLeft
} from 'react-icons/fa'
import Link from 'next/link';
import 'simplebar/dist/simplebar.min.css'
import SidebarFooterIcon from '@/components/klaudsolcms/dropdown/SidebarFooterIcon';
import AppButtonSpinner from '@/components/klaudsolcms/AppButtonSpinner';
import RootContext from '@/components/contexts/RootContext';
import { useRouter } from 'next/router'

const CollapsedSidebar = ({sidebarButtons, firstName, lastName, defaultEntityType, router, setCollapse}) => {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  // Transform to reducer
  const [isShowAdminSub, setIsShowAdminSub] = useState(false);
  const [headerDropdown, setHeaderDropdown] = useState(false);
  const [addContentTypeModal, showAddContentTypeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const { pathname } = useRouter();

  const onSubmit = () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  }
  
  return (
    <CSidebar
     className='collapsed-sidebar'
      position='fixed'
      visible={true}
      narrow
      onVisibleChange={() => {
        //dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand to="/admin" className='sidebar_brand'>
        {/*<CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
        */}
        <CDropdown 
          className="sidebar_header--dropdown"
          direction="dropend"
          onShow={() => setHeaderDropdown(true)}
          onHide={() => setHeaderDropdown(false)}
        >
          <CDropdownToggle 
              className="sidebar_header--toggle" 
              variant="ghost" 
              caret={false} 
              size="lg"
              split
          >
              {headerDropdown && <FaChevronRight />}
              {rootState.entityTypes.length !== 0 && 
                  pathname.includes('content-type-builder') &&
                  !headerDropdown &&
                  <FaBuilding /> }
              {rootState.entityTypes.length !== 0 && 
                  (!pathname.includes('content') ||
                  pathname.includes('content-manager')) &&
                  !headerDropdown &&
                  <FaFeatherAlt /> }
              {rootState.entityTypes.length === 0 && <AppButtonSpinner /> }
          </CDropdownToggle>
          <CDropdownMenu className="sidebar_collapse_header--menu">
              <CDropdownItemPlain className="sidebar_header--item">
                  <Link href={`/admin/content-manager/${defaultEntityType}`}>
                     <FaFeatherAlt /> Content Manager
                  </Link>
              </CDropdownItemPlain>
              <CDropdownDivider />
              <CDropdownItemPlain className="sidebar_header--item">
                  <Link href={`/admin/content-type-builder/${defaultEntityType}`}>
                      <FaBuilding /> Content-type Builder
                  </Link>
              </CDropdownItemPlain>
          </CDropdownMenu>
         </CDropdown>
      </CSidebarBrand>

      <CSidebarNav className="sidebar_nav">
        <div className='collapsed-sidebar-items'>
            <div>
                {sidebarButtons.map((button, i) => (
                 <Link key={i} href={button.title === 'Content Manager' || button.title === 'Content-Type Builder' ? button.path + `${defaultEntityType}` : button.path} passHref>
                  <div className='collapsed-buttons' key={i}>
                    <button className={router.asPath?.includes?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons'} passHref>{button.icon}</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </CSidebarNav>
    

      <div className='d-flex align-items-start justify-content-start mx-0 px-0 py-0 mx-2'>
      <SidebarFooterIcon title={`${firstName.charAt(0)}${lastName.charAt(0)}`} />
      <button className='sidebar_footer_collapse' onClick={() => setCollapse(false)}> <FaChevronRight /> </button>
      </div>
   

    </CSidebar>
  )
}

export default React.memo(CollapsedSidebar)
