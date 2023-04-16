const AppButtonSm = ({ icon, title, isDisabled, className, ...props }) => (
    <button className={`btn_general_sm ${className}`} disabled={isDisabled} {...props}>
      {icon} {title}
    </button>
);

export default AppButtonSm;
