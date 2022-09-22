import React, { useContext } from 'react'

import { CSidebar, CSidebarBrand, CSidebarNav} from '@coreui/react'

import { FaClock, FaTruck, 
FaFeatherAlt, FaSearch, FaShoppingCart
} from 'react-icons/fa'

import { IoExtensionPuzzleSharp} from 'react-icons/io5'

import { BiBuildings, BiNetworkChart } from 'react-icons/bi';

import { BsFillGearFill } from 'react-icons/bs';


import { MdOutlinePermMedia } from 'react-icons/md';

import { useState } from 'react';

import Link from 'next/link';

import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";

import { useRouter } from 'next/router'

// sidebar nav config
import navigation from './_nav'

const AppSidebar = () => {
  //const dispatch = useDispatch()
  //const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  //const sidebarShow = useSelector((state) => state.sidebarShow)

  const router = useRouter()

  const cache = useContext(CacheContext);
 
 

  const [categories, setCategories] = useState([
    { title: "PLUGINS" },
    { title: "GENERAL" },
  ].filter(item => item))
  
  const [sidebarButtons, setSidebarButtons] = useState([
    {
      mainCategory: "PLUGINS",
      title: "Content-Type Builder",
      path: "/admin/plugins/content-type-builder",
      icon: <BiBuildings className='sidebar_button_icon'/>
    },
    {
      mainCategory: "PLUGINS",
      title: "Media Library",
      path: "/admin/plugins/media-library",
      icon: <MdOutlinePermMedia className='sidebar_button_icon'/>
    },
    {
      mainCategory: "PLUGINS",
      title: "SEO",
      path: "/admin/plugins/seo",
      icon: <FaSearch className='sidebar_button_icon'/>
    },
    {
      mainCategory: "PLUGINS",
      title: "ER Chart",
      path: "/admin/plugins/entity-relationship-chart",
      icon: <BiNetworkChart className='sidebar_button_icon'/>
    },
    {
      mainCategory: "GENERAL",
      title: "Plugins",
      path: "/admin/list-plugins",
      icon: <IoExtensionPuzzleSharp className='sidebar_button_icon'/>
    },
    {
      mainCategory: "GENERAL",
      title: "ER Chart",
      path: "/admin/marketplace",
      icon: <FaShoppingCart className='sidebar_button_icon'/>
    },
    {
      mainCategory: "GENERAL",
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

          <Link href='/admin/content-manager' passHref>
            <div className='sidebar_button_container'>
            <button className={router.asPath?.includes?.('content-manager') ? 'sidebar_buttons_active' : 'sidebar_buttons'}><FaFeatherAlt className='sidebar_button_icon'/> Content Manager </button>
            </div>
          </Link>

          {categories.map((category, i) => (
            <div key={i}>
                <p className='sidebar_category_title'>{category.title}</p>
                {sidebarButtons.map((button, i) => (
                 category.title === button.mainCategory && (
                 <Link href={button.path} passHref>
                  <div className='sidebar_button_category_container'>
                    <button className={router.asPath?.includes?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons'} passHref>{button.icon} {button.title}</button>
                  </div>
                </Link>)
              ))}

            </div>
              
              ))}

          </div>
      
          {/*<AppSidebarNav items={navigation} />*/}

      </CSidebarNav>
      {/*
      <CSidebarToggler
        className="d-none d-lg-flex"
        //onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        //onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
      />
      */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
