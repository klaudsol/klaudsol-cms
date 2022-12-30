import { FaFeatherAlt, FaRegUser } from 'react-icons/fa'
import { BiBuildings } from 'react-icons/bi';
import { BsFillGearFill } from 'react-icons/bs';
import { HiOutlineUserCircle } from 'react-icons/hi';
import React, { useState, useContext, useEffect } from 'react';
import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";

import { useRouter } from 'next/router'

// sidebar nav config
import FullSidebar from './sidebar/FullSidebar';
import CollapsedSidebar from './sidebar/CollapsedSidebar';
import { SET_COLLAPSE } from 'components/reducers/actions';
import RootContext from '@/components/contexts/RootContext';

const AppSidebar = () => {

  const router = useRouter()

  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const cache = useContext(CacheContext);
  const { firstName = null, lastName = null, defaultEntityType = null } = cache ?? {};
  
  const [sidebarButtons, setSidebarButtons] = useState([
    {
      title: "Content Manager",
      path: `/admin/content-manager/`,
      icon: <FaFeatherAlt className='sidebar_button_icon'/>
    },
    {
      title: "Content-Type Builder",
      path: `/admin/content-type-builder/`,
      icon: <BiBuildings className='sidebar_button_icon'/>
    },
    {
      title: "Profile",
      path: "/admin/me",
      icon: <FaRegUser className='sidebar_button_icon'/>
    },
    /*{
      title: "Settings",
      path: "/admin/settings",
      icon: <BsFillGearFill className='sidebar_button_icon'/>
    },*/

  ].filter(item => item))

    /*** Entity Types List ***/
    useEffect(() => { 
     rootState.collapse === null ? rootDispatch({type: SET_COLLAPSE, payload: true}) : null
    }, [rootState.collapse]);
  
  return (
    <>
     {rootState.collapse ? <CollapsedSidebar sidebarButtons={sidebarButtons} firstName={firstName} lastName={lastName} defaultEntityType={defaultEntityType} router={router} setCollapse={e => rootDispatch({type: SET_COLLAPSE, payload: e})}/> : <FullSidebar sidebarButtons={sidebarButtons} firstName={firstName} lastName={lastName} defaultEntityType={defaultEntityType} router={router} setCollapse={e => rootDispatch({type: SET_COLLAPSE, payload: e})} />}
    </>
  )
}

export default React.memo(AppSidebar)
