//import React from 'react'
import {
  CAvatar,
//  CBadge,
  CDropdown,
//  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { useContext, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter} from 'next/router'; 
import RootContext from '@/components/contexts/RootContext';
import CacheContext from '@/components/contexts/CacheContext';

import avatar8 from '@/public/assets/images/avatars/patrick-square.png'
import { slsFetch } from "@klaudsol/commons/lib/Client";

import Link from 'next/link';


const AppHeaderDropdown = () => {

  const router = useRouter();
  
  const { state, dispatch } = useContext(RootContext);
  const { token } = useContext(CacheContext);
  
  const onLogout = (evt) => {
    evt.preventDefault();   
    const callback = async () => {
      await slsFetch('/api/session',{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        }
      });
      dispatch({type: 'RESET_CLIENT_SESSION'});
      router.push('/');
    };
    callback();
  };
  return (
    
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <FaUserCircle className='avatar-img' />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        {/*<CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>(/)
        {/*<CDropdownDivider />*/}
        {/*<CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        */}

       


          <CDropdownItem onClick={onLogout} href="#">
            {/*<CIcon icon={cilAccountLogout} className="me-2" />*/}
              Log out
          </CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
