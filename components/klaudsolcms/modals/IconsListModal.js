import AppModal from "@/components/klaudsolcms/AppModal";
import { useFormikContext } from "formik";
import * as BiIcons from "react-icons/bi";

const IconsListModal = ({ show, onClose, onClick, name }) => {
  const { setFieldValue } = useFormikContext();

  const onTap = (e) => {
    setFieldValue(name, e.currentTarget.value);
    onClose();
  };

  return (
    <AppModal
      show={show}
      onClose={onClose}
      onClick={onClick}
      modalTitle="Choose an icon"
      size="default"
      noSubmit
    >
      {Object.keys(BiIcons).map((icon) => {
        const CurrentIcon = BiIcons[icon];

        return (
          <button onClick={onTap} key={icon} value={icon}>
            <CurrentIcon />
          </button>
        );
      })}
    </AppModal>
  );
};

export default IconsListModal;
