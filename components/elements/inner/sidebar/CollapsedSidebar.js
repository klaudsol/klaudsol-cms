
import { CSidebar, CSidebarBrand, CSidebarFooter, CSidebarNav} from '@coreui/react'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import React from 'react';

import Link from 'next/link';

import 'simplebar/dist/simplebar.min.css'

import SidebarFooterIcon from '@/components/klaudsolcms/dropdown/SidebarFooterIcon';

const CollapsedSidebar = ({entityTypeLinks, sidebarButtons, firstName, lastName, defaultEntityType, router, setCollapse}) => {
  
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
         <Link href='/admin' className='sidebar_header' passHref>
            <b>  CMS  </b>
         </Link>
          
        
      </CSidebarBrand>


      <CSidebarNav>
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
