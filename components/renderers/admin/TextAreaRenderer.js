import cx from 'classnames';
;
export default function TextRenderer({className, ...params}) {
  return (
    <textarea className={cx('input_textarea', className)} {...params}  />
  );  
}