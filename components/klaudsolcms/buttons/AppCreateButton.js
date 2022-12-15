import { FaPlus } from "react-icons/fa";
import Link from 'next/link';
const AppCreateButton = ({title, link, onClick}) => (
        <button className="btn_create_entry" onClick={onClick}> 
            <FaPlus className="icon_general"/>
            {title}
        </button>
    )
 
export default AppCreateButton;