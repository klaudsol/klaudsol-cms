import cx from 'classnames';
import { CButton } from '@coreui/react'
import SMESkeleton from '@sme/SMESkeleton';

const SMEButton = ({className, loading, children,...props}) => {
  
  return (
    <>
      { loading && (
        <SMESkeleton className={className} />
      )}
      {!loading &&
        <CButton className={cx('btn-dark w-100', className)} {...props}>
          {children}
        </CButton>
      }
    </>
  );
  
};

export default SMEButton;