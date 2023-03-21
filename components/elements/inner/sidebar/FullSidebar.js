
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
    FaChevronLeft, 
    FaChevronUp, 
    FaChevronDown,
    FaFeatherAlt,
    FaBuilding,
    FaPlus
} from 'react-icons/fa'
import React,{ useState, useRef } from 'react';
import Link from 'next/link';
import 'simplebar/dist/simplebar.min.css'
import CollectionTypeBody from "@/components/klaudsolcms/modals/modal_body/CollectionTypeBody";
import SidebarFooterIcon from '@/components/klaudsolcms/dropdown/SidebarFooterIcon';
import AppContentLink from '@/components/klaudsolcms/routers/AppContentLink';
import AppModal from "@/components/klaudsolcms/AppModal";
import { BiBuildings } from 'react-icons/bi';
import { BsFillGearFill } from 'react-icons/bs';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { useRouter } from 'next/router'

import cx from 'classnames';

const FullSidebar = ({sidebarButtons, firstName, lastName, defaultEntityType, router, setCollapse}) => {
  const [isShowAdminSub, setIsShowAdminSub] = useState(false);
  const [headerDropdown, setHeaderDropdown] = useState(false);
  const [addContentTypeModal, showAddContentTypeModal] = useState(false);
  const formRef = useRef();
  const { pathname } = useRouter();

  const onSubmit = () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
    showAddContentTypeModal(false)
  }

  return (
    <>
        <CSidebar
         className='sidebar_container'
          position='fixed'
          visible={true}
          onVisibleChange={() => {
            //dispatch({ type: 'set', sidebarShow: visible })
          }}
        >
          <CSidebarBrand className='sidebar_brand'>
            {/*<CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
            <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
            */}
              <CDropdown 
                className="sidebar_header--dropdown"
                direction="center"
                onShow={() => setHeaderDropdown(true)}
                onHide={() => setHeaderDropdown(false)}
              >
                <CDropdownToggle 
                    className="sidebar_header--toggle" 
                    variant="ghost" 
                    caret={false} 
                    split
                >
                    {pathname.includes('content-type-builder') && 
                     <> <FaBuilding /> Content-type Builder </>}
                    {(!pathname.includes('content') || 
                     pathname.includes('content-manager')) && 
                     <> <FaFeatherAlt /> Content Manager </>}
                    {headerDropdown && <FaChevronUp />}
                    {!headerDropdown && <FaChevronDown />}
                </CDropdownToggle>
                <CDropdownMenu className="sidebar_header--menu">
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
            <div className='sidebar_container'>
                <div>
                    {sidebarButtons.map((button, i) => {

                     return !button.multiple ? 
                     <div className='sidebar_button_category_container' key={i}>
                        {(button.title === 'Content Manager' || button.title === 'Content-Type Builder')
                          ? <AppContentLink button={button} /> 
                          : <Link 
                              key={i} 
                              href={button.path} 
                              className={cx(router.asPath?.includes?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons')}
                              passHref
                            >
                              {button.icon} {button.title}
                            </Link>}
                      </div>
                      :
                      <div className='sidebar_button_category_container' key={i}>
                        <div className='sidebar_buttons' onClick={()=>{setIsShowAdminSub(prev => !prev)}}>{button.icon} {button.title} {<MdKeyboardArrowUp width="2em" className={isShowAdminSub ? 'arrowbutton active' : 'arrowbutton'}/>}</div>                   
                        {isShowAdminSub && button.subItems.map((item, i)=> (
                            <Link 
                            key={i} 
                            href={item.subPath} 
                            className={cx(router.asPath?.includes?.(item.subPath) ? 'sidebar_buttons_active sub_button' : 'sidebar_buttons sub_button')}
                            passHref
                        >
                          {item.subIcon} {item.subTitle}
                        </Link>
                        ))}
                        {/* <Link 
                            key={i} 
                            href={button.title === 'Content Manager' || button.title === 'Content-Type Builder' ? button.path + `${defaultEntityType}` : button.path} 
                            className={cx(router.asPath?.includes?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons')}
                            passHref
                        >
                          {button.icon} {button.title}
                        </Link> */}
                      </div>
                 })}
                </div>
              </div>
          </CSidebarNav>

            {pathname.includes('content-type-builder') && 
             <button className="content_create_button--non_submenu" onClick={() => showAddContentTypeModal(true)}><FaPlus className="content_create_icon"/> Create new collection type</button>
            }
            <CSidebarFooter className='sidebar_footer'>
                <div className='d-flex align-items-center justify-content-between'> 
                    <div className='d-flex flex-row align-items-center'>
                        <SidebarFooterIcon title={`${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`} />
                        <h6 className='sidebar_footer_name'> {firstName} {lastName} </h6>
                    </div>
                    <button className='sidebar_footer_collapse' onClick={() => setCollapse(true)}> <FaChevronLeft /> </button>
                </div>
            </CSidebarFooter>
        </CSidebar>

        <AppModal
            show={addContentTypeModal}
            onClose={() => showAddContentTypeModal(false)}
            onClick={onSubmit}
            modalTitle="Create a collection type"
            buttonTitle="Continue"
        >
            <CollectionTypeBody formRef={formRef} />
        </AppModal>
    </>
  )
}

export default React.memo(FullSidebar)
