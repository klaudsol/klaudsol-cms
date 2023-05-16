
import { CSidebar, CSidebarBrand, CSidebarFooter, CSidebarNav} from '@coreui/react'
import { FaChevronLeft } from 'react-icons/fa'
import React,{ useState } from 'react';
import Link from 'next/link';
import 'simplebar/dist/simplebar.min.css'
import SidebarFooterIcon from '@/components/klaudsolcms/dropdown/SidebarFooterIcon';
import { BiBuildings } from 'react-icons/bi';
import { BsFillGearFill } from 'react-icons/bs';
import { MdKeyboardArrowUp } from 'react-icons/md';

import cx from 'classnames';

const FullSidebar = ({sidebarButtons, firstName, lastName, defaultEntityType, router, setCollapse}) => {
  
  const [expandedSubitems, setExpandSubitems] = useState([]);
  const noop = () => {};

  const handleExpandSubitems = (path) => {
    if(expandedSubitems.includes(path)) {
        setExpandSubitems(expandedSubitems.filter((itemPath) => itemPath !== path));
    } else {
        setExpandSubitems([...expandedSubitems, path]);
    }
  }
  
  return (
    <CSidebar
     className='sidebar_container'
      position='fixed'
      visible={true}
      onVisibleChange={() => {
        //dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand to="/admin" className='sidebar_brand'>
        {/*<CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
        */}
         <Link href='/admin' className='sidebar_header' passHref>
            <b>Dashboard</b>
          </Link>
          
        
      </CSidebarBrand>

      <CSidebarNav>
        <div className='sidebar_container'>
            <div>
                {sidebarButtons.map((button, i) => {

                 return !button.multiple ? 
                 <div className='sidebar_button_category_container' key={i}>
                    <Link 
                        key={i} 
                        href={button.title === 'Content Manager' || button.title === 'Content-Type Builder' ? button.path + `${defaultEntityType}` : button.path} 
                        className={cx(router.asPath?.endsWith?.(button.path) ? 'sidebar_buttons_active--link' : 'sidebar_buttons--link')}
                        passHref
                    >
                        <div className={cx(router.asPath?.endsWith?.(button.path) ? 'sidebar_buttons_active' : 'sidebar_buttons')}>
                            {button.icon} 
                              {button.title}
                        </div>
                    </Link>
                  </div>
                  :
                  <div className='sidebar_button_category_container' key={i}>
                    <div className='sidebar_buttons' onClick={()=>{handleExpandSubitems(button.path)}}>{button.icon} {button.title} {<MdKeyboardArrowUp width="2em" className={expandedSubitems.includes(button.path) ? 'arrowbutton' : 'arrowbutton active'}/>}</div>
                    {expandedSubitems.includes(button.path) && button.subItems.map((item, i)=> (
                        <Link 
                        key={i} 
                        href={item.subPath} 
                        onClick={item.onClick ?? noop}
                        className={cx((router.asPath?.endsWith?.(item.subPath) && item.highlight !== false) ? 'sidebar_buttons_active sub_button' : 'sidebar_buttons sub_button')}
                        passHref
                    >
                      {item.subIcon} {item.subTitle}
                    </Link>
                    ))}
                  </div>
             })}
            </div>
          </div>
      </CSidebarNav>

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
  )
}

export default React.memo(FullSidebar)
