
import { CSidebar, CSidebarBrand, CSidebarFooter, CSidebarNav} from '@coreui/react'

import { FaFeatherAlt, FaChevronLeft } from 'react-icons/fa'

import { BiBuildings } from 'react-icons/bi';

import { BsFillGearFill } from 'react-icons/bs';

import { MdOutlinePermMedia } from 'react-icons/md';

import React, { useState, useContext } from 'react';

import Link from 'next/link';

import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";

import SidebarFooterIcon from '@/components/klaudsolcms/dropdown/SidebarFooterIcon';

import { useRouter } from 'next/router'

// sidebar nav config
import navigation from './_nav'

const AppSidebar = () => {
  //const dispatch = useDispatch()
  //const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  //const sidebarShow = useSelector((state) => state.sidebarShow)

  const router = useRouter()

  const cache = useContext(CacheContext);
  const { firstName = null, lastName = null, defaultEntityType = null } = cache ?? {};
 

  const [categories, setCategories] = useState([
    { title: "PLUGINS" },
    { title: "GENERAL" },
  ].filter(item => item))
  
  const [sidebarButtons, setSidebarButtons] = useState([
    {
      title: "Content Manager",
      path: `/admin/content-manager/`,
      icon: <FaFeatherAlt className='sidebar_button_icon'/>
    },
    {
      title: "Content-Type Builder",
      path: `/admin/plugins/content-type-builder/`,
      icon: <BiBuildings className='sidebar_button_icon'/>
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <BsFillGearFill className='sidebar_button_icon'/>
    },

  ].filter(item => item))
  
  return (
    <CSidebar
     className='sidebar_container'
      position='fixed'
      unfoldable={false}
      visible={true}
      onVisibleChange={() => {
        //dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand to="/admin" className='sidebar_brand'>
        {/*<CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
        */}
         <Link href='/admin' passHref>
         <a className='sidebar_header'> <b> KlaudSol CMS Dashboard </b> </a>
          </Link>
          
        
      </CSidebarBrand>

      <CSidebarNav>
        <div className='sidebar_container'>
            <div>
                {sidebarButtons.map((button, i) => (
                 <Link key={i} href={button.title === 'Content Manager' || button.title === 'Content-Type Builder' ? button.path + `${defaultEntityType}` : button.path} passHref>
                  <div className='sidebar_button_category_container' key={i}>
                    <button className={router.asPath?.includes?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons'} passHref>{button.icon} {button.title}</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </CSidebarNav>

      <CSidebarFooter className='sidebar_footer'>
        <div className='d-flex align-items-center justify-content-between'> 
       <div className='d-flex flex-row align-items-center'>
      <SidebarFooterIcon title={`${firstName.charAt(0)}${lastName.charAt(0)}`} />
        <h6 className='sidebar_footer_name'> {firstName} {lastName} </h6>
       </div>
        <button className='sidebar_footer_collapse'> <FaChevronLeft /> </button>
        </div>
       
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
