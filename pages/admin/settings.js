import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import { Formik, Form } from "formik";
import { useRef } from "react";
import UploadRenderer from "@/components/renderers/admin/UploadRenderer";

export default function Settings({cache}) {

  const formRef = useRef()
  const logoSlug = "logoSlug";

  const onSubmit = (evt) => {
    evt.preventDefault();
    formRef.current.handleSubmit();
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: {Image:''},
    onSubmit: (values) => {
      (async () => {

        try {
         

        } catch (ex) {
          console.error(ex);
        } finally {
         
        }
      })();
    },
  };
   


  return (
    <CacheContext.Provider value={cache}>
      <InnerSingleLayout>
        <div>
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <h3 className="mt-5"> Settings </h3>
               <Formik {...formikParams}>
                 {(props)=>(
                    <Form>
                       <UploadRenderer
                        accept="image/png, image/gif, image/jpeg"
                        name=""
                        touched={props.touched}
                        error={props.errors}
                        type="IMAGE"
                       />
                    </Form>
                 )} 
               </Formik>
            </div>
           </div>
        </div>
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
