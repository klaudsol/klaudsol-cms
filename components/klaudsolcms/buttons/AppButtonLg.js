const AppButtonLg = ({icon, title, isDisabled}) => {
    return <button className="btn_general_lg" disabled={isDisabled}> {icon} {title}  </button>    ;
}
 
export default AppButtonLg;