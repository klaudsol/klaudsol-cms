import cx from 'classnames';
import { useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import SMEIconStyles from '@/lib/sme/scss/SMEIcon.module.scss';

const SMEIcon = ({Icon, label, className='', iconType, linkTo, bgColor, iconColor, codeReady}) => {
  
  
  const iconContainerRef = useRef();
  const MyLink = !!codeReady ? Link : (props) => <div {...props}>{props.children}</div>;
  
  useLayoutEffect(() => {
    
    if(bgColor && iconContainerRef.current) {
      iconContainerRef.current.style.setProperty('background-color', bgColor, 'important');  
    }
    
  }, [bgColor]);
  
  return (
    <Link href={linkTo} passHref={true}>
          <div className={cx('col-lg-12 col-md-4 mb-2 text-center', SMEIconStyles.app_dashboard)}>
              <div ref={iconContainerRef} className={cx('col-12 theme-color', className, SMEIconStyles.app_dashboard__icon_container)} >
                <span className={cx('text-light', SMEIconStyles.app_dashboard__icon)}>
                    {Icon && <Icon />}
                  </span> 
              </div>
              <div className='text-center'>
                <span className={cx('text-dark', SMEIconStyles.app_dashboard__icon_label)}>{label}</span>  
              </div>  
          </div>
    </Link>
  );
};

SMEIcon.defaultProps = {
  iconType: 'coreui',
  codeReady: true,
  bgColor: null
};

export default SMEIcon;