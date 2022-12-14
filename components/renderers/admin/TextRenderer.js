import cx from 'classnames';
import { Field } from 'formik';

export default function TextRenderer({className, ...params}) {
  return (
    <Field type="text" className={cx("input_text mb-2", className)} {...params} />
  );  
}