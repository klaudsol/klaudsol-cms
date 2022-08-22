//import './scss/SMESkeleton.scss';
import cx from 'classnames';

const SMESkeleton = ({className, block, blockStyle, children, loading, ...props}) => {
  
  const Component = ({children, ...props}) => block ? <div {...props}>{children}</div> : <span {...props}>{children}</span>;
  const _blockStyle = {...{'height': 'auto', }, ...blockStyle};
  
  return (
      <>
      {!loading &&
        <>
          {children}
        </>
      }
      {loading &&
        <Component className={cx('skeleton-box', className)} {...props} style={{...( block ?  _blockStyle : {})}}>
          <Component style={{display: 'inline-block', opacity: 0}}>
            {children}
          </Component>
        </Component> 
      }
      </>
  );
  
};

SMESkeleton.defaultProps = {
  block: false,  
  loading: true
}

export default SMESkeleton;