import RootContext from '@/components/contexts/RootContext';
import { useContext, useEffect, useState, useRef } from 'react';
import SkeletonContentBuilder from "@/components/klaudsolcms/skeleton/SkeletonContentBuilder";
import AppContentBuilderButtons from "@/components/klaudsolcms/buttons/AppContentBuilderButtons";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import { loadEntityType } from '@/components/reducers/actions';
import { slsFetch } from '@/components/Util';  
import AddEditAnotherFieldModal, {EDIT_MODE} from '@/components/klaudsolcms/modals/AddEditAnotherFieldModal';

const AppContentBuilderTable = ({typeSlug}) => {

   const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setModalVisible] = useState(false);
   const [isEditModalVisible, setEditModalVisible] = useState(false);
   const [currentAttribute, setCurrentAttribute] = useState();
   const [formParams, setFormParams] = useState({});
   const formRef = useRef();

   const data = ({rootState, typeSlug}) => Object.entries(rootState.entityType[typeSlug]?.data ?? {});
   const hasHash = ({rootState, typeSlug}) => rootState.entityType[typeSlug]?.metadata?.hash;

    useEffect(() => {
      (async () => {
        await loadEntityType({rootState, rootDispatch, typeSlug, 
          onStartLoad: () => setLoading(true),
          onEndLoad: () => setLoading(false)
        });
      })();
    }, [typeSlug]);

    const onDeleteAttributeConfirmation = attribute => evt => {
      setModalVisible(true);
      setCurrentAttribute(attribute);
    };

    const onDeleteAttribute = attribute => evt => {
      (async () => {
        try {
          const valuesRaw = await slsFetch(`/api/entity_types/${typeSlug}/attributes/${attribute?.name}`, {
            method: "DELETE"
          });  
          const values = await valuesRaw.json();
  
         } catch (ex) {
          console.error(ex.stack);
         } finally {
          await loadEntityType({rootState, rootDispatch, typeSlug});
          setModalVisible(false);
         }
      })();
    };

    const onEditAttribute = attribute => evt => {
      setEditModalVisible(true);
      setCurrentAttribute(attribute);
      setFormParams(updateFormParamsFromAttribute(attribute));
    };

    const onUpdateField = evt => {
     if(formRef.current) formRef.current.handleSubmit();
    };

    const updateFormParamsFromAttribute = attribute => ({
      innerRef: formRef,
      initialValues: {
        name: attribute?.name,
        type: attribute?.type,
        order: attribute?.order
      },
      onSubmit: (values) => {
        
 
        (async () => {
          try {

            const response = await slsFetch(`/api/entity_types/${typeSlug}/attributes/${attribute?.name}`, {
              method: 'PUT',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                attribute: {
                ...values
                }
             })
            });

          } catch(ex) {
            console.error(ex);  
          } finally {
            await loadEntityType({rootState, rootDispatch, typeSlug});
            setEditModalVisible(false);
          }
        })();
      }
    });

    return ( 
        <>
          {!hasHash({rootState, typeSlug}) && loading && (
            <SkeletonContentBuilder />
          )}

          {hasHash({rootState, typeSlug}) && (

            <table id="table_general">
                {/*table head*/}
                <thead> 
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Order</th>
                      <th>&nbsp;</th>
                    </tr>
                </thead>
                {/*table body*/}
                <tbody>
                {data({rootState, typeSlug}).map(([attributeName, attribute]) => (
                    <tr key={attributeName}>
                      <td>{attributeName}</td>
                      <td>{attribute.type}</td>
                      <td>{attribute.order}</td>
                      <td>
                        <AppContentBuilderButtons 
                          isDisabled={false} 
                          onDelete={onDeleteAttributeConfirmation(attribute)} 
                          onEdit={onEditAttribute(attribute)}
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
            </table>

          )}

          {/*Delete confirmation modal */}
          <AppInfoModal 
            show={isModalVisible} 
            modalTitle={'Delete confirmation'}
            onClose={() => setModalVisible(false)}
            onClick={onDeleteAttribute(currentAttribute)}
            isConfirmDialog={true}
          >
            Are you sure you want to delete attribute &quot;{currentAttribute?.name}&quot;?
          </AppInfoModal>

          {/*Edit modal */} 
          <AddEditAnotherFieldModal 
            mode={EDIT_MODE}
            show={isEditModalVisible}
            formParams={formParams}
            onClose={() => setEditModalVisible(false)}
            onClick={onUpdateField}
          />
        </> 
    );
}
 
export default AppContentBuilderTable;
