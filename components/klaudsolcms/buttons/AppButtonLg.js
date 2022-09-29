const AppButtonLg = ({icon, title, isDisabled, onClick}) => {
    return <button className="btn_general_lg" disabled={isDisabled} onClick={onClick}> {icon} {title}  </button>    ;
}
 
export default AppButtonLg;