
import cx from 'classnames';
import { Field } from 'formik';

export default function FloatRenderer({className, ...params}) {
  return (
    <Field type="number" className={cx("input_text mb-2", className)} {...params} />
  );  
}