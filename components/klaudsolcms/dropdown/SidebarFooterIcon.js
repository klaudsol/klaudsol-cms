import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Link from 'next/link'
import { useContext } from 'react';
import { useRouter } from 'next/router'; 
import RootContext from '@/components/contexts/RootContext';
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { RESET_CLIENT_SESSION } from '@/lib/actions';
import CacheContext from '@/components/contexts/CacheContext';

const SidebarFooterIcon = ({title}) => {
    const router = useRouter();
    const { token = null } = useContext(CacheContext);
  
  const { state, dispatch } = useContext(RootContext);
    const onLogout = (evt) => {
        evt.preventDefault();   
        const callback = async () => {
          await slsFetch('/api/session',{
            headers: {
              Authorization: `Bearer ${token}`
            },
            method: "DELETE"
          });
          dispatch({type: RESET_CLIENT_SESSION});
          router.push('/');
        };
        callback();
      };
    return ( 
         <DropdownButton drop='up' id='sidebar_footer_icon' title={title}>
            <Dropdown.Item className='sidebar_footer_items'><Link href='/admin/me' className='sidebar_footer_profile'>Profile</Link></Dropdown.Item>
            <Dropdown.Item className='sidebar_footer_items'><button className='sidebar_footer_logout' onClick={onLogout}> Log out </button></Dropdown.Item>
        </DropdownButton>
     );
}
 
export default SidebarFooterIcon;   
