import { FaPlus } from "react-icons/fa";

const AppCreateButton = ({title}) => {
    return <button className="btn_create_entry"> <FaPlus className="icon_general"/> {title} </button>
}
 
export default AppCreateButton;