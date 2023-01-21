import { FaPlus } from "react-icons/fa";
import Link from 'next/link';
const AppCreateButton = ({title, link}) => {
    return (
        <Link href={link ? link : '/'} passHref><button className="btn_create_entry"> <FaPlus className="icon_general"/>{title}</button></Link>
    )
}
 
export default AppCreateButton;
