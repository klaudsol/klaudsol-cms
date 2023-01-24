import AppModal from "@/components/klaudsolcms/AppModal";
import { Formik, Form, Field } from "formik";

export const ADD_MODE = "ADD_MODE";
export const EDIT_MODE = "EDIT_MODE";

 const AddEditAnotherFieldModal = ({
  formParams,
  show,
  onClose,
  onClick,
  mode,
  isLoading,
}) => (
    <AppModal
      show={show}
      onClose={onClose}
      onClick={onClick}
      isLoading={isLoading}
      modalTitle={mode === ADD_MODE ? 'Add another field' : 'Edit field'} 
      buttonTitle={mode === ADD_MODE ? 'Add': 'Update'}> 
    {/* TODO: */}
    {/* <AddFieldBody /> */}
    <Formik {...formParams}>
      <Form>
        
        <table id="table_general">
        {/*table head*/}
        <thead> 
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Order</th>
            </tr>
        </thead>
        <tbody>
            <tr>
              <td><Field name='name' className='input_text' /></td>
              <td className='table-box'>
                  <Field name='type' component='select' className='input_text'>
                    {/*TODO: Make dynamic please */}
                    <option value="text">Text</option>
                    <option value="textarea">Text Area</option>
                    <option value="link">Link</option>
                    <option value="image">Image</option>
                    <option value="float">Number</option>
                  </Field>
              </td>
              <td className='table-box'><Field name='order' className='input_text'  type='number' /></td>
            </tr>
        </tbody>
    </table>
      </Form>
    </Formik>
  </AppModal>

  );

  export default AddEditAnotherFieldModal;
