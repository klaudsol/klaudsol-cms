import cx from 'classnames';
;
export default function TextRenderer({className, ...params}) {
  return (
    <input type="text" className={cx("input_text mb-2", className)} {...params} />
  );  
}