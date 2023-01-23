import AppModal from "@/components/klaudsolcms/AppModal";
import { Formik, Form, Field } from "formik";
import { inputValues } from "./modal_body/constants";

export const ADD_MODE = "ADD_MODE";
export const EDIT_MODE = "EDIT_MODE";

export default function AddEditAnotherFieldModal({
  formParams,
  show,
  onClose,
  onClick,
  mode,
}) {
  return (
    <AppModal
      show={show}
      onClose={onClose}
      onClick={onClick}
      modalTitle={mode === ADD_MODE ? "Add another field" : "Edit field"}
      buttonTitle={mode === ADD_MODE ? "Add" : "Update"}
    >
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
                <td>
                  <Field name="name" className="input_text" />
                </td>
                <td className="table-box">
                  <Field name="type" component="select" className="input_text">
                    {inputValues.map((e, key) => {
                      return (
                        <option key={key} value={e.value}>
                          {e.option}
                        </option>
                      );
                    })}
                  </Field>
                </td>
                <td className="table-box">
                  <Field name="order" className="input_text" type="number" />
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </Formik>
    </AppModal>
  );
}
