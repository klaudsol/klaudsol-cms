import Modal from 'react-bootstrap/Modal';
import { Poppins } from '@next/font/google';
import { FaTimes } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import cx from "classnames";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const ErrorModal = ({ show, message, hide }) => {
  return (
    <Modal 
      show={show} 
      centered
      size='md'
      onHide={hide}
    >
      <Modal.Body className={cx(poppins.className, "general-modal-error-body")}>
        <div className="general-modal-error">
          <div className="general-modal-error-icon-container">
            <div className="general-modal-error-header">
              <div className="general-modal-error-header-icon" onClick={hide}>
                <FaTimes />
              </div>
            </div>
            <IoIosCloseCircleOutline className="general-modal-error-icon" />
          </div>
          <div className="general-modal-error-title"> Ooops! </div>
          {message}
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default ErrorModal;