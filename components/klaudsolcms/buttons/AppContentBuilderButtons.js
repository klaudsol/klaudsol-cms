import { MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const AppContentBuilderButtons = ({isDisabled}) => {
    return ( 
    <div className="d-flex align-items-center justify-content-end mx-0 px-0 py-0 my-0">
        <button className='icon_edit' disabled={isDisabled}> <MdModeEditOutline /> </button>
        <button className='icon_delete' disabled={isDisabled}> <FaTrash /> </button>
    </div> );
}
 
export default AppContentBuilderButtons;