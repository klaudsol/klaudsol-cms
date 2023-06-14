import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaTimes } from "react-icons/fa";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";

import { Poppins } from '@next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
const AppModal = ({
  show,
  onClose,
  onClick,
  modalTitle,
  children,
  buttonTitle,
  isLoading,
  noSubmit,
  loadingAlt,
  size = "lg"
}) => (
  <Modal 
   show={show} 
   onHide={!isLoading ? onClose : null} 
   centered 
   size={size}
   className={poppins.className}
   >
    <Modal.Header className="general-modal-header">
      <Modal.Title className="general-modal-header-title">{modalTitle} {isLoading && loadingAlt && <AppButtonSpinner />}</Modal.Title>
      <button 
        disabled={isLoading} 
        className="general-modal-header-close" 
        onClick={onClose}
      >
        <FaTimes />
      </button>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer className="modal_header">
      {isLoading && !loadingAlt && <AppButtonSpinner />}
      {!noSubmit && 
        <Button disabled={isLoading} className="general-modal-button" onClick={onClick}>
          {buttonTitle}
         </Button>}
    </Modal.Footer>
  </Modal>
);

export default AppModal;
