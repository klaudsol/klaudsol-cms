import { useContext } from "react";
import { Formik, Form, Field } from "formik";
import { loadEntityTypes } from "@/components/reducers/actions";
import { slsFetch } from '@klaudsol/commons/lib/Client';
import RootContext from "@/components/contexts/RootContext";
import DependentField from "@/components/fields/DependentField";
import { useClientErrorHandler } from "@/components/hooks"
import { defaultEntityTypeVariant, entityTypeVariants } from "@/constants";

export default function CollectionTypeBody({ formRef, hide, setSaving }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const errorHandler = useClientErrorHandler();

  const formikParams = {
    initialValues: {
      name: "",
      slug: "",
      variant: defaultEntityTypeVariant,
    },
    innerRef: formRef,
    onSubmit: (values) => {
      (async () => {
        try {
          //refactor to reducers/actions
          setSaving(true);
          await slsFetch(`/api/entity_types`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          errorHandler(error);
        } finally {
          await loadEntityTypes({ rootState, rootDispatch });
          setSaving(false);
          hide();
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

  return (
    <>
      <Formik {...formikParams}>
        <Form>
          <div>
            <div className="content-type-create-container">
              <div className="content-type-create">
                <div className="general-text"> Display Name </div>
                <Field type="text" className="general-input-text" name="name" />
              </div>
              <div className="content-type-create">
                <div className="general-text"> API ID &#40;Slug&#41; </div>
                <DependentField
                  type="text"
                  className="general-input-text"
                  name="slug"
                  fieldToMirror="name"
                  format={dependentFieldFormat}
                />
                <div className="general-description">
                  The UID is used to generate the API routes and databases
                  tables/collections
                </div>
              </div>
              <div className="content-type-create">
                <div className="general-text"> Variant </div>
                <Field 
                  name="variant" 
                  component="select" 
                  className="general-dropdown"
                >
                  {entityTypeVariants.map((e, key) => (<option key={key} value={e.value}>{e.option}</option>))}
                </Field>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}
