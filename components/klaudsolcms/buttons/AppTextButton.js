const AppTextButton = ({ icon, title, isDisabled, className, ...props }) => {
    return <button type='button' className={`btn_text ${className}`} disabled={isDisabled} {...props}> {icon} {title} </button>;
}

export default AppTextButton;
