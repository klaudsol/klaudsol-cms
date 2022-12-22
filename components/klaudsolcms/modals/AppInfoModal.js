import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaTimes } from 'react-icons/fa'
const AppInfoModal = ({show, onClose, onClick, modalTitle, children, buttonTitle, isConfirmDialog=false}) => {
    return ( 
        <>
        <Modal show={show} onHide={onClose}>
            <Modal.Header className='modal_header'>
              <Modal.Title>{modalTitle}</Modal.Title>
              <button className="icon_modal_close" onClick={onClose}> <FaTimes /> </button>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer className='modal_header'>
              {!isConfirmDialog &&
                <Button className='btn_modal' onClick={onClick}>
                  {buttonTitle}
                </Button>
              }
              {isConfirmDialog &&
                <>
                  <Button className='btn_modal' onClick={onClick}>
                    OK
                  </Button>
                  <Button className='btn_modal' onClick={onClose}>
                    Cancel 
                  </Button>
                </>
              }
            </Modal.Footer>
          </Modal>
        </>
     );
}
 
export default AppInfoModal;