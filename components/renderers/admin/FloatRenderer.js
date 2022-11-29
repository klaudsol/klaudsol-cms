
import cx from 'classnames';
;
export default function FloatRenderer({className, ...params}) {
  return (
    <input type="number" className={cx("input_text mb-2", className)} {...params} />
  );  
}