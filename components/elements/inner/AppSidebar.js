import { FaFeatherAlt, FaRegUser } from 'react-icons/fa';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { BiBuildings } from 'react-icons/bi';
import { BsFillGearFill } from 'react-icons/bs';
import { RiSettings3Line, RiAdminLine } from 'react-icons/ri';
import { AiOutlineLock } from 'react-icons/ai';
import React, { useState, useContext, useEffect } from 'react';
import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";

import { useRouter } from 'next/router'

// sidebar nav config
import FullSidebar from './sidebar/FullSidebar';
import CollapsedSidebar from './sidebar/CollapsedSidebar';
import { SET_COLLAPSE } from '@/lib/actions';
import RootContext from '@/components/contexts/RootContext';
import { useCapabilities } from '@/components/hooks';
import { writeSettings, readUsers,  readGroups } from "@/lib/Constants";

const AppSidebar = () => {

  const router = useRouter();
  const capabilities = useCapabilities();
  console.log(capabilities)
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
    (capabilities.includes(writeSettings) ? {
      title: "Settings",
      path: "/admin/settings",
      icon: <RiSettings3Line className='sidebar_button_icon'/>
    }:null),
    (capabilities.includes(readUsers) || capabilities.includes(readGroups) ? {
      multiple: true,
      title: "Admin",
      subItems:[capabilities.includes(readUsers) ?
                {subTitle:"Users", 
                 subIcon:<HiOutlineUser className='sidebar_button_icon'/>,
                 subPath:"/admin/users" 
                }: null,

                capabilities.includes(readGroups) ? 
                {subTitle:"Groups",
                 subIcon:<HiOutlineUserGroup className='sidebar_button_icon'/>,
                 subPath:"/admin/groups"
                } : null].filter(item => item),
      icon: <AiOutlineLock className='sidebar_button_icon'/>
    }:null)
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
