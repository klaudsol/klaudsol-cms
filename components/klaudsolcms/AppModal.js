import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AppModal = ({show, onClose, onClick, modalTitle, children, buttonTitle}) => {
    return ( 
        <>
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={onClose}>
                {buttonTitle}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
     );
}
 
export default AppModal;