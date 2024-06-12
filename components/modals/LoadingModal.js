import Modal from 'react-bootstrap/Modal';
import LoadingScreen from '../loading/LoadingScreen';
import { Poppins } from '@next/font/google';
import { FaTimes } from 'react-icons/fa';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import cx from "classnames";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const LoadingModal = ({ show, loading, message, hide }) => {
  return (
    <Modal 
      show={show} 
      centered
      size='md'
      onHide={!loading ? () => hide() : null}
    >
      <Modal.Body className={cx(poppins.className, "general-modal-loading-body-default", {"general-modal-loading-body" : !loading} )}>
        {loading && <LoadingScreen />}
        {!loading && 
          <div className="general-modal-loading">
            <div className="general-modal-loading-icon-container">
              <div className="general-modal-loading-header">
                <div className="general-modal-loading-header-icon" onClick={hide}>
                  <FaTimes />
                </div>
              </div>
              <IoIosCheckmarkCircleOutline className="general-modal-loading-icon" />
            </div>
            <div className="general-modal-loading-title"> Great! </div>
            {message}
          </div>}
      </Modal.Body>
    </Modal>
  )
}
export default LoadingModal;