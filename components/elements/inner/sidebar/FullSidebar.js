
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
import {
  LOADING,
  SET_ADD_CONTENT_TYPE_MODAL,
  SET_HEADER_DROPDOWN,
} from "@/lib/actions";
import React,{ useState, useRef, useContext } from 'react';
import RootContext from '@/components/contexts/RootContext';
import Link from 'next/link';
import 'simplebar/dist/simplebar.min.css'
import useSidebarReducer from "@/components/reducers/sidebarReducer";
import CollectionTypeBody from "@/components/klaudsolcms/modals/modal_body/CollectionTypeBody";
import SidebarFooterIcon from '@/components/klaudsolcms/dropdown/SidebarFooterIcon';
import AppButtonSpinner from '@/components/klaudsolcms/AppButtonSpinner';
import AppContentLink from '@/components/klaudsolcms/routers/AppContentLink';
import AppModal from "@/components/klaudsolcms/AppModal";
import { BiBuildings } from 'react-icons/bi';
import { BsFillGearFill } from 'react-icons/bs';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { useRouter } from 'next/router'

import cx from 'classnames';

const FullSidebar = ({sidebarButtons, firstName, lastName, defaultEntityType, router, setCollapse}) => {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const [state, setState] = useSidebarReducer();

  const formRef = useRef();
  const { pathname } = useRouter();

  const onSubmit = () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
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
                onShow={() => setState(SET_HEADER_DROPDOWN, true)}
                onHide={() => setState(SET_HEADER_DROPDOWN, false)}
              >
                <CDropdownToggle 
                    className="sidebar_header--toggle" 
                    variant="ghost" 
                    caret={false} 
                    split
                >
                    {/* Status Icon */}
                    {rootState.entityTypes.length !== 0 && 
                        pathname.includes('content-type-builder') &&
                        <FaBuilding /> }
                    {rootState.entityTypes.length !== 0 && 
                        (!pathname.includes('content') ||
                        pathname.includes('content-manager')) &&
                        <FaFeatherAlt /> }
                    {rootState.entityTypes.length === 0 && <AppButtonSpinner /> }

                    {/* Header */}
                    {pathname.includes('content-type-builder') && 
                        'Content-type Builder'}
                    {(!pathname.includes('content') || 
                     pathname.includes('content-manager')) && 
                        'Content Manager'}

                    {/* Dropdown icon */}
                    {state.showHeaderDropdown && <FaChevronUp />}
                    {!state.showHeaderDropdown && <FaChevronDown />}
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
                {sidebarButtons.map((button) => (
                    <div className='sidebar_button_category_container' key={button.entity_type_slug}>
                        <Link 
                            href={button.path} 
                            className={cx(router.asPath?.includes?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons')}
                            passHref
                        >
                            <div>{button.icon}</div>{button.title}
                        </Link>
                    </div>
                ))}
            </div>
          </CSidebarNav>

            {pathname.includes('content-type-builder') && 
             <button 
                className="content_create_button--non_submenu" 
                onClick={() => setState(SET_ADD_CONTENT_TYPE_MODAL, true)}
              >
                <FaPlus className="content_create_icon"/> 
                Create new collection type
              </button>
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
            show={state.showAddContentTypeModal}
            onClose={() => setState(SET_ADD_CONTENT_TYPE_MODAL, false)}
            onClick={onSubmit}
            modalTitle="Create a collection type"
            buttonTitle="Continue"
            isLoading={state.isLoading}
        >
            <CollectionTypeBody 
                formRef={formRef} 
                setModal={(value) => setState(SET_ADD_CONTENT_TYPE_MODAL, value)} 
                setLoading={(value) => setState(LOADING, value)} 
            />
        </AppModal>
    </>
  )
}

export default React.memo(FullSidebar)
