import { FaFeatherAlt, FaRegUser, FaPlus } from 'react-icons/fa';
import { HiOutlineUser, HiOutlineUserGroup, HiUserAdd } from 'react-icons/hi';
import { BiPen, BiPlug } from 'react-icons/bi';
import * as Icons from "react-icons/bi";
import { RiSettings3Line } from 'react-icons/ri';
import { AiOutlineLock } from 'react-icons/ai';
import React, { useState, useContext, useEffect, useRef } from 'react';
import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";
import AppModal from "@/components/klaudsolcms/AppModal";
import CollectionTypeBody from "@/components/klaudsolcms/modals/modal_body/CollectionTypeBody";
import { useRouter } from 'next/router'

// sidebar nav config
import FullSidebar from './sidebar/FullSidebar';
import CollapsedSidebar from './sidebar/CollapsedSidebar';
import { SET_COLLAPSE } from '@/lib/actions';
import RootContext from '@/components/contexts/RootContext';
import { useCapabilities } from '@/components/hooks';
import { writeSettings, writeContentTypes, readUsers,  readGroups, writeContents, readPendingUsers } from "@/lib/Constants";
import { loadEntityTypes } from '@/components/reducers/actions';
import pluginMenus from '@/plugin-menus.json';

const AppSidebar = () => {

  const router = useRouter();
  const capabilities = useCapabilities();
  const formRef = useRef();
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const cache = useContext(CacheContext);
  const { firstName = null, lastName = null, defaultEntityType = null } = cache ?? {};
  const [isCollectionTypeBodyVisible, setCollectionTypeBodyVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const onModalSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }

  };

  const pluginMenuLinks = pluginMenus.menus.map(plugin => {
    const PluginMenuIcon = Icons[plugin.icon] ?? "BiPlug";
    return capabilities.includes(plugin.capability) ? {
      title: plugin.title,
      path: plugin.link,
      icon: <PluginMenuIcon className='sidebar_button_icon'/>,
      ...(plugin?.multiple && { multiple: plugin.multiple }),
      ...(plugin?.subItems && {
        subItems: plugin.subItems.map((subItem) => {
          const SubItemIcon = Icons[subItem.icon] ?? Icons.BiChevronRight;

          return capabilities.includes(subItem.capability) ?
              {
                  subTitle: subItem.title,
                  subIcon: <SubItemIcon className='sidebar_button_icon'/>,
                  subPath: subItem.link
              } : null
        }).filter((subItem) => subItem)
      })
    } : null
    ;
  }).filter(x => x);

  const entityTypeLinks = (capabilities.includes(writeContents) ? rootState.entityTypes.map(type => {
    const Icon = Icons[type.entity_type_icon ?? "BiPen"];

    return {
      title: type.entity_type_name,
      path: `/admin/content-manager/${type.entity_type_slug}`,
      icon: <Icon className='sidebar_button_icon'/>
    }}) : 
    []
  );

  // These will be used multiple times
  const canReadUsers = capabilities.includes(readUsers);
  const canReadPendingUsers = capabilities.includes(readPendingUsers);
  const canReadGroups = capabilities.includes(readGroups);

  const sidebarButtons = [
    (capabilities.includes(writeContentTypes) && {
      multiple: true,
      title: "Content Type Editor",
      path: `/admin/content-type-builder/`,
      icon: <FaFeatherAlt className='sidebar_button_icon'/>,
      subItems: [
        ...rootState.entityTypes.map(type => ({
        subTitle: `${type.entity_type_name} Type`,
        subPath: `/admin/content-type-builder/${type.entity_type_slug}`
      })),
      {
        subTitle: 'New Type',
        subPath: '#',
        subIcon:  <FaPlus className="content_create_icon" />,
        onClick: () => {setCollectionTypeBodyVisible(true)},
        highlight: false
      }
    ]
    }),
    ((canReadUsers || canReadPendingUsers || canReadGroups) && {
      multiple: true,
      title: "Admin",
      path: "/admin",
      icon: <AiOutlineLock className='sidebar_button_icon'/>,
      subItems:[canReadUsers ?
                {subTitle:"Users", 
                 subIcon:<HiOutlineUser className='sidebar_button_icon'/>,
                 subPath:"/admin/users" 
                }: null,
                canReadPendingUsers ?
                {subTitle:"Pending Users", 
                 subIcon:<HiUserAdd className='sidebar_button_icon'/>,
                 subPath:"/admin/users/pending" 
                }: null,
                false && canReadGroups ? 
                {subTitle:"Groups",
                 subIcon:<HiOutlineUserGroup className='sidebar_button_icon'/>,
                 subPath:"/admin/groups"
                } : null].filter(item => item)
    }),
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
  ].filter(item => item);

    useEffect(() => { 
     rootState.collapse === null ? rootDispatch({type: SET_COLLAPSE, payload: true}) : null
    }, [rootState.collapse]);

    useEffect(() => { 
      (async () => {
        await loadEntityTypes({rootState, rootDispatch});
      })();
    }, [rootState]);
  
  return (
    <>
     {rootState.collapse && 
      <CollapsedSidebar 
        entityTypeLinks={entityTypeLinks} 
        sidebarButtons={[...entityTypeLinks, ...pluginMenuLinks, ...sidebarButtons]} 
        firstName={firstName} 
        lastName={lastName} 
        defaultEntityType={defaultEntityType} 
        router={router} 
        setCollapse={e => rootDispatch({type: SET_COLLAPSE, payload: e})}/> 
     }  
     
     {!rootState.collapse && 
        <FullSidebar 
          sidebarButtons={[...entityTypeLinks, ...pluginMenuLinks, ...sidebarButtons]} 
          firstName={firstName} 
          lastName={lastName} 
          defaultEntityType={defaultEntityType} 
          router={router} 
          setCollapse={e => rootDispatch({type: SET_COLLAPSE, payload: e})} />
     }
      <AppModal
        show={isCollectionTypeBodyVisible}
        onClose={() => setCollectionTypeBodyVisible(false)}
        onClick={onModalSubmit}
        modalTitle="Create a Content Type"
        buttonTitle="Save"
        isLoading={saving}
      >
        <CollectionTypeBody formRef={formRef} setSaving={setSaving} hide={() => setCollectionTypeBodyVisible(false)} />
      </AppModal>
    </>
  )
}

export default React.memo(AppSidebar)
