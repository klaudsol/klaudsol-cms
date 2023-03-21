import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Link from 'next/link'
import { useContext } from 'react';
import { useRouter } from 'next/router'; 
import RootContext from '@/components/contexts/RootContext';
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { RESET_CLIENT_SESSION } from '@/lib/actions';
import { useCapabilities } from '@/components/hooks';
import { writeSettings } from "@/lib/Constants";

const SidebarFooterIcon = ({title}) => {
  const router = useRouter();
  const capabilities = useCapabilities();
  
  const { state, dispatch } = useContext(RootContext);
  const onLogout = (evt) => {
        evt.preventDefault();   
        const callback = async () => {
          await slsFetch('/api/session',{
            method: "DELETE"
          });
          dispatch({type: RESET_CLIENT_SESSION});
          router.push('/');
        };
        callback();
      };

    return ( 
         <DropdownButton drop='up' id='sidebar_footer_icon' title={title}>
            <Dropdown.Item className='sidebar_footer_items'><Link href='/admin/me' className='sidebar_footer_item'>Profile</Link></Dropdown.Item>
            {capabilities.includes(writeSettings) && 
                <Dropdown.Item className='sidebar_footer_items'><Link href='/admin/settings' className='sidebar_footer_item'>Settings</Link></Dropdown.Item>
            }
            <Dropdown.Item className='sidebar_footer_items'><button className='sidebar_footer_item' onClick={onLogout}> Log out </button></Dropdown.Item>
        </DropdownButton>
     );
}
 
export default SidebarFooterIcon;   
