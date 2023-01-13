const AppButtonSm = ({ icon, title, isDisabled, ...props }) => (
    <button className="btn_general_sm" disabled={isDisabled} {...props}>
      {icon} {title}
    </button>
);

export default AppButtonSm;
