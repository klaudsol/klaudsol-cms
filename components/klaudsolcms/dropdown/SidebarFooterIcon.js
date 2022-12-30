import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Link from 'next/link'
import { useContext } from 'react';
import { useRouter } from 'next/router'; 
import RootContext from '@/components/contexts/RootContext';
import { slsFetch } from '@/components/Util';
import { RESET_CLIENT_SESSION } from '@/components/reducers/actions';

const SidebarFooterIcon = ({title}) => {
    const router = useRouter();
  
  const { state, dispatch } = useContext(RootContext);
    const onLogout = (evt) => {
        evt.preventDefault();   
        const callback = async () => {
          await slsFetch('/api/logout');
          dispatch({type: RESET_CLIENT_SESSION});
          router.push('/');
        };
        callback();
      };
    return ( 
         <DropdownButton drop='up' id='sidebar_footer_icon' title={title}>
            <Dropdown.Item className='sidebar_footer_items'><Link href='/admin/me'><a className='sidebar_footer_profile'>Profile</a></Link></Dropdown.Item>
            <Dropdown.Item className='sidebar_footer_items'><button className='sidebar_footer_logout' onClick={onLogout}> Log out </button></Dropdown.Item>
        </DropdownButton>
     );
}
 
export default SidebarFooterIcon;   