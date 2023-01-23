import cx from 'classnames';
const AppButtonLg = ({icon, title, isDisabled, className, ...props}) => {
    return <button type='button' className={cx('btn_general_lg', className)} disabled={isDisabled} {...props}> {icon} {title}  </button>    ;
}
 
export default AppButtonLg;