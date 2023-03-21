import { FaFeatherAlt, FaRegUser, FaChevronRight } from 'react-icons/fa';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { BiBuildings } from 'react-icons/bi';
import { BsFillGearFill } from 'react-icons/bs';
import { RiSettings3Line, RiAdminLine } from 'react-icons/ri';
import { AiOutlineLock } from 'react-icons/ai';
import React, { useState, useContext, useEffect } from 'react';
import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";

import { useRouter } from 'next/router'
import { loadEntityTypes } from '@/components/reducers/actions';
import { findContentTypeName } from "@/components/Util";
import { SET_CURRENT_ENTITY_TYPE } from "@/lib/actions"

// sidebar nav config
import FullSidebar from './sidebar/FullSidebar';
import CollapsedSidebar from './sidebar/CollapsedSidebar';
import { SET_COLLAPSE } from '@/lib/actions';
import RootContext from '@/components/contexts/RootContext';
import { useCapabilities } from '@/components/hooks';
import { writeSettings, readUsers,  readGroups } from "@/lib/Constants";

const AppSidebar = () => {

  const router = useRouter();
  const { pathname, query: { entity_type_slug } } = router;
  const capabilities = useCapabilities();
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const cache = useContext(CacheContext);
  const { firstName = null, lastName = null, defaultEntityType = null } = cache ?? {};

  /*** Entity Types List ***/
  useEffect(() => { 
    (async () => {
      await loadEntityTypes({
        rootState, 
        rootDispatch, 
        currentTypeSlug: entity_type_slug ?? cache.defaultEntityType
      });
    })();
  }, []);

  useEffect(() => {
    if(!entity_type_slug || rootState.entityTypes.length === 0) return;

    const currentEntityType = findContentTypeName(rootState.entityTypes, entity_type_slug)

    rootDispatch({ type: SET_CURRENT_ENTITY_TYPE, payload: currentEntityType })
  }, [entity_type_slug])

  // We can't get the baseUrl directly from next router, and if we are on the
  // settings page, profile page etc., we want it to default to the content manager
  const baseUrl = router.pathname.startsWith('/admin/content-type-builder') ?
                  '/admin/content-type-builder' :
                  '/admin/content-manager';

  const sidebarButtons = rootState.entityTypes.map(({ entity_type_name, entity_type_slug }) => ({
        title: entity_type_name,
        path: `${baseUrl}/${entity_type_slug}`,
        icon: <FaChevronRight className='sidebar_button_icon'/>
    }))

    useEffect(() => { 
     rootState.collapse === null ? rootDispatch({type: SET_COLLAPSE, payload: true}) : null
    }, [rootState.collapse]);
  
  return (
    <>
     {rootState.collapse ? 
        <CollapsedSidebar 
            sidebarButtons={sidebarButtons} 
            firstName={firstName} 
            lastName={lastName} 
            defaultEntityType={defaultEntityType} 
            router={router} 
            setCollapse={(e) => rootDispatch({type: SET_COLLAPSE, payload: e})}
        /> : 
        <FullSidebar 
            sidebarButtons={sidebarButtons} 
            firstName={firstName} 
            lastName={lastName} 
            defaultEntityType={defaultEntityType} 
            router={router}
            setCollapse={(e) => rootDispatch({type: SET_COLLAPSE, payload: e})} 
        />}
    </>
  )
}

export default React.memo(AppSidebar)
