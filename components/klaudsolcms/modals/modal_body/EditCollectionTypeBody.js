import { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import { loadEntityTypes } from "@/components/reducers/actions";
import RootContext from "@/components/contexts/RootContext";

export default function EditCollectionTypeBody({ formRef }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const router = useRouter();
  const slug = router.query.entity_type_slug;

  // Find the name of the current entity type
  const entityTypes = rootState.entityTypes;
  const currentEntityType = entityTypes.find(
    (eType) => eType.entity_type_slug === slug
  );
  const name = currentEntityType?.entity_type_name;

  const formikParams = {
    initialValues: {
      name,
      slug,
    },
    innerRef: formRef,
    onSubmit: (values) => {
      (async () => {
        try {
          //refactor to reducers/actions
          await fetch(`/api/entity_types/${slug}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          });

          router.push(`/admin/content-type-builder/${values.slug}`);
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
                <Field 
                    type="text" 
                    className="input_text"
                    name="name" 
                />
              </div>
              <div className="col">
                <p className="mt-2"> API ID &#40;Slug&#41; </p>
                <Field 
                    type="text" 
                    className="input_text"
                    name="slug" 
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
