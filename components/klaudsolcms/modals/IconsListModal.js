import AppModal from "@/components/klaudsolcms/AppModal";

const IconsListModal = ({ show, onClose, onClick }) => {
  return (
    <AppModal
      show={show}
      onClose={onClose}
      onClick={onClick}
      modalTitle="Choose an icon"
      buttonTitle="Submit"
      size="default"
    >
      IconsListModal
    </AppModal>
  );
};

export default IconsListModal;
