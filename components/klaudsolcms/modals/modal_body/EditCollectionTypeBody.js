import { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import { loadEntityTypes } from "@/components/reducers/actions";
import RootContext from "@/components/contexts/RootContext";

export default function EditCollectionTypeBody({ formRef, hideModal }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const router = useRouter();
  const currentSlug = router.query.entity_type_slug;
  const entityTypes = rootState.entityTypes;
  const currentEntityType = entityTypes.find(
    (etype) => etype.entity_type_slug === currentSlug
  );
  // Component renders 4 times upon submitting the form.
  // The name and the slug are undefined in 2/4 of the renders
  // which will cause an error
  const name = currentEntityType?.entity_type_name;
  const slug = currentEntityType?.entity_type_slug;

  const formikParams = {
    initialValues: {
      name,
      slug,
    },
    innerRef: formRef,
    onSubmit: (values) => {
      console.error(JSON.stringify(values));
      (async () => {
        try {
          //refactor to reducers/actions
          await fetch(`/api/entity_types/${currentSlug}`, {
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
          hideModal();
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
            <div className="block_bar"></div>
            <div className="row">
              <div className="col">
                <p className="mt-2"> Display Name </p>
                <Field type="text" className="input_text" name="name" />
              </div>
              <div className="col">
                <p className="mt-2"> API ID &#40;Slug&#41; </p>
                <Field type="text" className="input_text" name="slug" />
                <p className="mt-1" style={{ fontSize: "10px" }}>
                  {" "}
                  The UID is used to generate the API routes and databases
                  tables/collections{" "}
                </p>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}
