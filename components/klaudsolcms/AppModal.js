import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaTimes } from "react-icons/fa";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
const AppModal = ({
  show,
  onClose,
  onClick,
  modalTitle,
  children,
  buttonTitle,
  isLoading,
}) => (
  <Modal 
   show={show} 
   onHide={!isLoading ? onClose : null} 
   centered size="lg"
   >
    <Modal.Header className="modal_header">
      <Modal.Title>{modalTitle}</Modal.Title>
      <button disabled={isLoading} className="icon_modal_close" onClick={onClose}>
        {" "}
        <FaTimes/>{" "}
      </button>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer className="modal_header">
      {isLoading && <AppButtonSpinner />}
      <Button disabled={isLoading} className="btn_modal" onClick={onClick}>
        {buttonTitle}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AppModal;
