import React, { useContext } from 'react'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import { FaClock, FaChevronDown, FaChevronUp, 
FaFileInvoice, FaAppStore, FaTruck, 
FaTable, FaUserClock, FaBlackTie,
FaFileInvoiceDollar
} from 'react-icons/fa'

import { IoAppsOutline} from 'react-icons/io5'

import { BiSpreadsheet, BiLocationPlus } from 'react-icons/bi';

import { BsCashCoin, BsFileEarmarkSpreadsheet } from 'react-icons/bs';

import { GrLocation } from 'react-icons/gr';

import { useState } from 'react';

import { Button, Card, Collapse } from 'reactstrap';

import Link from 'next/link';

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";

// sidebar nav config
import navigation from './_nav'

const AppSidebar = () => {
  //const dispatch = useDispatch()
  //const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  //const sidebarShow = useSelector((state) => state.sidebarShow)

  const cache = useContext(CacheContext);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [apps, setApps] = useState([
    (cache?.apps?.includes?.('trucking'))  ? {
      appName: "Trucking", 
      appIcon: <FaTruck className='sidebar_icon'/>,
      collapseOpen: false,
    } : null,
    
    (cache?.apps?.includes?.('timetracking'))  ? {
      appName: "Timetracking",
      appIcon: <FaClock className='sidebar_icon'/>,
      collapseOpen: false,
    } : null
    
  ].filter(item => item));

  const [subApps, setSubApps] = useState([
    
    (cache?.apps?.includes?.('trucking'))  ? {
      mainApp: "Trucking",
      appName: "Trip Ticket",
      appPath: "app/trucking/trip-tickets",
      appIcon: <BiSpreadsheet className='sidebar_icon'/>
    } : null,
    
    (cache?.apps?.includes?.('trucking'))  ? {
      mainApp: "Trucking",
      appName: "Collection",
      appPath: "app/trucking/collection",
      appIcon: <BsCashCoin className='sidebar_icon'/>
    } : null,
    
    (cache?.apps?.includes?.('trucking'))  ? {
      mainApp: "Trucking",
      appName: "Reports",
      appPath: "app/trucking/reports",
      appIcon: <BsFileEarmarkSpreadsheet className='sidebar_icon'/>
    } : null,
    
    (cache?.apps?.includes?.('trucking'))  ? {
      mainApp: "Trucking",
      appName: "Locations",
      appPath: "/app/trucking/locations",
      appIcon: <BiLocationPlus className='sidebar_icon'/>
    } : null,
    
    (cache?.apps?.includes?.('timetracking'))  ? {
      mainApp: "Timetracking",
      appName: "Timesheet",
      appPath: "/app/timetracking",
      appIcon: <FaUserClock className='sidebar_icon'/>
    } : null,
    
    (cache?.permissions?.includes?.('manage') && cache?.apps?.includes?.('timetracking'))  ? {
      mainApp: "Timetracking",
      appName: "Invoice",
      appPath: "/app/timetracking/invoice",
      appIcon: <FaFileInvoiceDollar className='sidebar_icon'/>
    } : null,
    
    (cache?.permissions?.includes?.('manage') && cache?.apps?.includes?.('timetracking')) ? {
      mainApp: "Timetracking",
      appName: "Reports",
      appPath: "/app/timetracking/reports",
      appIcon: <FaTable className='sidebar_icon'/>
    } : null,
    
    (cache?.permissions?.includes?.('manage') && cache?.apps?.includes?.('timetracking')) ? {
      mainApp: "Timetracking",
      appName: "Professional Fees",
      appPath: "/app/timetracking/professional_fee",
      appIcon: <FaBlackTie className='sidebar_icon'/>
    } : null,
    
  ].filter(item => item))
  
  function onCollapse(name){
    var app = apps;
    app.map((app) => {
      if(app.appName == name){
        app.collapseOpen = !app.collapseOpen
      } else {
        app.collapseOpen = false;
      }
    })
    setApps(app);
    setCollapseOpen(!collapseOpen);
  }


  const [path, setPath] = useState('/app');
  return (
    <CSidebar
      position='fixed'
      unfoldable={false}
      visible={true}
      onVisibleChange={() => {
        //dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand to="/">
        {/*<CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
        */}
        <CImage src='/sme-logo-no-border.png' width={35} align='start'/>
          <h1> SME</h1>
        
      </CSidebarBrand>
      <CSidebarNav>
        <div className=''>
              <Card className='sidebar_collapse'>
                <Link href='/dashboard'><button className='sidebar_sub_items' passHref><IoAppsOutline className='sidebar_icon'/>Apps</button></Link>
              </Card>
              {apps.map((app) => (
                <>
                  <Button
                  className='sidebar_btn_timetracking'
                  onClick={() => onCollapse(app.appName)}
                  >
                  {app.appIcon} {app.appName} {!app.collapseOpen ? <FaChevronDown/> : <FaChevronUp/> } </Button>
                   <Collapse isOpen={app.collapseOpen}>
                    {subApps.map((sub_app) => (
                      <>
                      {
                        sub_app.mainApp == app.appName && (
                        <Card className='sidebar_collapse'>
                          <Link href={sub_app.appPath}><button className='sidebar_sub_items' passHref>{sub_app.appIcon} {sub_app.appName}</button></Link>
                       </Card>
                       )
                      }
                        </>
                    ))}
                   </Collapse>
                </>
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
