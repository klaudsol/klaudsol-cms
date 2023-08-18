import { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import { loadEntityTypes } from "@/components/reducers/actions";
import RootContext from "@/components/contexts/RootContext";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { redirectToBuilderTypeSlug } from "@/components/klaudsolcms/routers/routersRedirect";
import { useClientErrorHandler } from "@/components/hooks";
import * as Icons from "react-icons/bi";

export default function EditCollectionTypeBody({ formRef, hide, setSaving }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const errorHandler = useClientErrorHandler();
  const router = useRouter();
  const slug = router.query.entity_type_slug;
  const iconNames = Object.keys(Icons); // gets list of all BiIcons

  // Find the name of the current entity type
  const entityTypes = rootState.entityTypes;
  const currentEntityType = entityTypes.find(
    (eType) => eType.entity_type_slug === slug
  );
  const name = currentEntityType?.entity_type_name;
  const variant = currentEntityType?.entity_type_variant;
  const icon = currentEntityType?.entity_type_icon;

  const [selectedIcon, setSelectedIcon] = useState(icon ? icon : 'BiPen');
  const [showIcons, setShowIcons] = useState(false);

  const CurrentIcon = Icons[selectedIcon];

  const formikParams = {
    initialValues: {
      name,
      slug,
      variant,
      icon: selectedIcon
    },
    innerRef: formRef,
    onSubmit: (values) => {
      (async () => {
        try {
          //refactor to reducers/actions
          setSaving(true);
          await slsFetch(`/api/entity_types/${slug}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          redirectToBuilderTypeSlug(router, values.slug);
        } catch (error) {
          errorHandler(error);
        } finally {
          console.log({ rootState });
          await loadEntityTypes({ rootState, rootDispatch });
          setSaving(false);
          hide();
        }
      })();
    },
  };

  // Shows the list of all icons
  const handleIconButton = (e) => {
    e.preventDefault();
    setShowIcons(!showIcons);
  }

  return (
    <>
      <Formik {...formikParams}>
      {({ setFieldValue }) => (
        <Form>
          <div>
            <div className="content-type-create-container">
              <div className="content-type-create">
                <div className="general-text"> Display Name </div>
                <Field type="text" className="general-input-text" name="name" />
              </div>
              <div className="content-type-create">
              <div className="general-text"> API ID &#40;Slug&#41; </div>
              <Field type="text" className="general-input-text" name="slug" />
              <div className="general-description">
                The UID is used to generate the API routes and databases
                tables/collections
              </div>
            </div>
              <div className="content-type-create">
                <div className="general-text"> Variant </div>
                <Field 
                  type="text"
                  name="variant" 
                  className="general-input-text"
                  disabled
                >
                </Field>
              </div>
              <div className="content-type-create">
                <div className="general-text"> Icon </div>
                  <button className="general-icon-button" onClick={handleIconButton}>
                    <CurrentIcon className="general-icon" />
                    {selectedIcon}
                  </button>
                  {showIcons && 
                  <div className="general-icons-container">
                    <div className="row mx-0 my-0 py-0 px-0" style={{ width: '100%'}}>
                      {iconNames.map((x, i) => {
                        const Icon = Icons[x];
                        return (
                        <div 
                          className="col-3 mx-0 my-1 py-0 px-1 text-center general-icons-border" 
                          key={i}
                          onClick={e => {
                            e.preventDefault();
                            setSelectedIcon(x);
                            setFieldValue('icon',  x);
                            setShowIcons(false);
                          }}
                        >
                          <Icon
                            className="general-icons"
                          />
                        </div>
                      )})}
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </Form>)}
      </Formik>
    </>
  );
}
