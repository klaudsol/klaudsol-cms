import cx from 'classnames';
import { Field } from 'formik';

export default function TextRenderer({className, ...params}) {
  return (
    <Field type="textarea" className={cx('input_textarea', className)} {...params}  />
  );  
}