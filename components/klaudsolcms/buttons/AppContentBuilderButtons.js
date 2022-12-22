import { MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const AppContentBuilderButtons = ({
  isDisabled, 
  showEdit=true, 
  showDelete=true,
  onEdit = () => {},
  onDelete = () => {}
}) => {
    return ( 
    <div className="d-flex align-items-center justify-content-end mx-0 px-0 py-0 my-0">
        {showEdit && <button className='icon_edit' disabled={isDisabled} onClick={onEdit}> <MdModeEditOutline /> </button>}
        {showDelete && <button className='icon_delete' disabled={isDisabled} onClick={onDelete}> <FaTrash /> </button>}
    </div> );
}
 
export default AppContentBuilderButtons;