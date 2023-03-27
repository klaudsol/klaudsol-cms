import AppModal from "@/components/klaudsolcms/AppModal";
import { useFormikContext } from "formik";
import { SET_CURRENT_ICON } from "@/lib/actions";
import * as BiIcons from "react-icons/bi";

const IconsListModal = ({ show, onClose, onClick, name, setState }) => {
  const { setFieldValue } = useFormikContext();

  const onTap = (e) => {
    const icon = e.currentTarget.value;

    setFieldValue(name, icon);
    // I have to set to state so that the current icon will be displayed.
    // For some reason, using the values within formik to display the icon
    // will cause a delay.
    setState(SET_CURRENT_ICON, icon);
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
      <div className="icon_list__container">
        {Object.keys(BiIcons).map((icon) => {
          const CurrentIcon = BiIcons[icon];

          return (
            <button className="icon_list__button" onClick={onTap} key={icon} value={icon}>
              <CurrentIcon className="icon_list__item"/>
            </button>
          );
        })}
      </div>
    </AppModal>
  );
};

export default IconsListModal;
