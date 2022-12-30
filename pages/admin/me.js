import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import { Formik, Form, Field } from 'formik';
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg';
import AppButtonSpinner from '@/components/klaudsolcms/AppButtonSpinner';
import { FaCheck } from "react-icons/fa";
import { useRef, useState } from 'react';
import { slsFetch } from '@/components/Util'; 
import AppModal from '@/components/klaudsolcms/AppModal';

export default function Settings({cache}) {

  const [isSaving, setSaving] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const formRef = useRef();

  const formikParams =  {
    innerRef: formRef,
    initialValues: {
      current_password: '',
      password: '',
      confirmation_password: ''
    },
    onSubmit: (values) => {

      (async () => {

        try {
          setSaving(true);
          const responseRaw = await slsFetch('/api/me/password', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          });
          const response = await responseRaw.json();
          setModalMessage(response.message);
          setModalTitle("Success");
        } catch (error) {
          setModalMessage(error.message);
          setModalTitle("Error");
        } finally {
          setSaving(false);
          setModalVisible(true);
        };


      })();

    }
  };

  const onClickSave = evt => {
    if(formRef.current) formRef.current.handleSubmit();
  };

  return (
    <CacheContext.Provider value={cache}>
      <InnerSingleLayout>
        <div>
          <div className="row">
            <div className="col-12">
              <div className='row mt-5'>
                <div className="col-12 col-md-10">
                  <h3> Profile </h3>
                </div>
                <div className='col-12 col-md-2 float-right'>
                  <AppButtonLg title={isSaving ? 'Saving' : 'Save'} icon={isSaving ? <AppButtonSpinner /> : <FaCheck />} onClick={onClickSave}/>
                </div>
              </div>

              <div className="mt-5 container_new_entry py-4 px-4">                   
                <Formik {...formikParams}               
                  >
                  <Form>
                    <div className='row'>
                      <h6 className="mt-1 mb-3">Change password</h6>
                      <label htmlFor='current_password' className='col-12 col-md-6'>Current Password</label>
                    </div>
                    <div className='row'>
                      <div className='col-12 col-md-6'>
                        <Field type='password'className="input_text mb-2" name='current_password' id='current_password' />
                      </div>
                    </div>
                    <div className='row mt-3'>
                      <label htmlFor='password' className='col-12 col-md-6'>Password</label>
                      <label htmlFor='confirmation_password' className='col-12 col-md-6'>Confirmation Password</label>
                      <div className='col-12 col-md-6'>
                        <Field type='password' className="input_text mb-2" name='password' id='password' />
                      </div>
                      <div className='col-12 col-md-6'>
                        <Field type='password' className="input_text mb-2" name='confirmation_password' id='confirmation_password' />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
           </div>
        </div>

        <AppModal show={isModalVisible} 
          onClose={() => setModalVisible(false) } 
          onClick={() => setModalVisible(false) } 
          modalTitle={modalTitle} buttonTitle='OK'> 
          {modalMessage}
        </AppModal>
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
