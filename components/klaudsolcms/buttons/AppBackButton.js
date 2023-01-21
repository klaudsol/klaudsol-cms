import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
const AppBackButton = ({link}) => {
    return <Link href={link ? link : '/'} ><button className="btn_back"> <FaArrowLeft className='icon_general' /> Back </button></Link>
}
 
export default AppBackButton;
