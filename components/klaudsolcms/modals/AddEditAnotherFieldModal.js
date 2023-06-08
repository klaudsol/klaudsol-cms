import AppModal from "@/components/klaudsolcms/AppModal";
import { Formik, Form, Field } from "formik";
import { inputValues } from "../../../constants";

export const ADD_MODE = "ADD_MODE";
export const EDIT_MODE = "EDIT_MODE";

const AddEditAnotherFieldModal = ({
    formParams,
    show,
    onClose,
    onClick,
    mode,
    isLoading,
}) => {
    const resetCustomNameField = (e, props) => {
        props.handleChange(e);

        if (mode === ADD_MODE) props.setFieldValue('customName', '');
    }

    return (
        <AppModal
            show={show}
            onClose={onClose}
            onClick={onClick}
            isLoading={isLoading}
            modalTitle={mode === ADD_MODE ? "Add another field" : "Edit field"}
            buttonTitle={mode === ADD_MODE ? "Add" : "Update"}
        >
            {/* <AddFieldBody /> */}
            <Formik {...formParams}>
                {(props) => (
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
                                        <Field name="type" component="select" onChange={(e) => resetCustomNameField(e, props)} className="input_text">
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
                        {props.values.type === 'custom' &&
                            <div className="custom-attribute">
                                <p className="custom-attribute__title">Custom Name</p>
                                <Field name="customName" className="input_text" />
                            </div>
                        }
                    </Form>
                )}
            </Formik>
        </AppModal>
    );
}

export default AddEditAnotherFieldModal;
