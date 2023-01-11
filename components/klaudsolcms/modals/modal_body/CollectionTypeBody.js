import { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, useFormikContext, useField } from "formik";
import { loadEntityTypes } from "@/components/reducers/actions";
import RootContext from "@/components/contexts/RootContext";

// TO BE SEPARATED INTO ANOTHER COMPONENT
function DependentField(props) {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const inputToMirror = props.inputToMirror;
  const value = values[inputToMirror];

  // Remove inputToMirror prop because it is not a legit input attribute
  // and it will give us a warning of we put it on input
  const filteredProps = Object.keys(props).reduce((acc, curr) => {
    if (curr === "inputToMirror") return acc;

    acc[curr] = props[curr];
    return acc;
  }, {});

  useEffect(() => {
    const nameSplit = value?.split(" ");
    const nameFiltered = nameSplit?.filter((i) => i !== ""); // For extra whitespaces
    const nameJoin = nameFiltered?.join("-");

    // Makes dashes instantly appear when user types space
    if (value?.endsWith(" ")) {
      const newName = `${nameJoin}-`;
      setFieldValue(props.name, newName);

      return;
    }

    setFieldValue(props.name, nameJoin);
  }, [name]);

  return <input {...filteredProps} {...field} />;
}

export default function CollectionTypeBody({ formRef }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const formikParams = {
    initialValues: {},
    innerRef: formRef,
    onSubmit: (values) => {
      (async () => {
        try {
          //refactor to reducers/actions
          await fetch(`/api/entity_types`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
        } finally {
          await loadEntityTypes({ rootState, rootDispatch });
        }
      })();
    },
  };

  return (
    <>
      <Formik {...formikParams}>
        <Form>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mx-3"> Configurations </h6>
              <div>
                <button className="btn_modal_settings"> Basic settings </button>
              </div>
            </div>
            <div className="block_bar" />
            <div className="row">
              <div className="col">
                <p className="mt-2"> Display Name </p>
                <Field type="text" className="input_text" name="name" />
              </div>
              <div className="col">
                <p className="mt-2"> API ID &#40;Slug&#41; </p>
                <DependentField
                  type="text"
                  className="input_text"
                  name="slug"
                  inputToMirror="name"
                />
                <p className="mt-1" style={{ fontSize: "10px" }}>
                  The UID is used to generate the API routes and databases
                  tables/collections
                </p>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}
