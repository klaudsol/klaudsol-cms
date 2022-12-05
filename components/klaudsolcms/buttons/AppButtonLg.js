import cx from 'classNames';
const AppButtonLg = ({icon, title, isDisabled, className, ...props}) => {
    return <button className={cx('btn_general_lg', className)} disabled={isDisabled} {...props}> {icon} {title}  </button>    ;
}
 
export default AppButtonLg;