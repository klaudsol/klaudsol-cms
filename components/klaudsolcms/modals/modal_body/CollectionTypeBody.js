import { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, useFormikContext, useField } from "formik";
import { TOGGLE_ICONS_LIST, SET_CURRENT_ICON } from "@/lib/actions";
import { loadEntityTypes } from "@/components/reducers/actions";
import useCollectionTypeBodyReducer from "@/components/reducers/collectionTypeBodyReducer";
import RootContext from "@/components/contexts/RootContext";
import DependentField from "@/components/fields/DependentField";
import IconsListModal from "@/components/klaudsolcms/modals/IconsListModal";
import * as BiIcons from "react-icons/bi";

export default function CollectionTypeBody({ formRef }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const [state, setState] = useCollectionTypeBodyReducer();

  const formikParams = {
    initialValues: {
      name: "",
      slug: "",
      icon: "BiPen",
    },
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

  const dependentFieldFormat = (value) => {
    const valueSplit = value?.split(" ");
    // Prevents extra spaces from becoming '-'
    const filteredSplit = valueSplit?.filter((i) => i !== "");
    const joinedSplit = filteredSplit?.join("-");
    const lowerCasedVal = joinedSplit?.toLowerCase();

    // If the user types in space as the first letter, a '-'
    // will appear, the trim() method below will prevent it
    if (value?.trim() === "") return "";
    if (value?.endsWith(" ")) return `${lowerCasedVal}-`;

    return lowerCasedVal;
  };

  const toggleIconsListModal = () => setState(TOGGLE_ICONS_LIST);

  const CurrentIcon = BiIcons[state.currentIcon];

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
                <button
                  type="button"
                  className="mt-2"
                  onClick={toggleIconsListModal}
                >
                  {<CurrentIcon />}
                </button>
              </div>
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
                  fieldToMirror="name"
                  format={dependentFieldFormat}
                />
                <p className="mt-1" style={{ fontSize: "10px" }}>
                  The UID is used to generate the API routes and databases
                  tables/collections
                </p>
              </div>
            </div>
          </div>
          <IconsListModal
            show={state.showIconsList}
            onClose={toggleIconsListModal}
            setState={setState}
            name="icon"
          />
        </Form>
      </Formik>
    </>
  );
}
