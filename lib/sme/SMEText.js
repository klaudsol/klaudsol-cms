import SMESkeleton from '@sme/SMESkeleton';
import cx from 'classnames';
//import '@sme/scss/SMEText.scss';

const SMEText = ({ loading, className, children }) => {
  
  return (
    <>
    { loading && (
      <SMESkeleton className={className} />
    )}
    { !loading && (
      <span className={cx('sme-text', className)}>
        {children}  
      </span>
    )}
    </>
  );
  
}

export default SMEText;