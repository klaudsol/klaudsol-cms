const AppButtonSm = ({icon, title, isDisabled}) => {
    return <button className="btn_general_sm" disabled={isDisabled}> {icon} {title}  </button>    ;
}
 
export default AppButtonSm;