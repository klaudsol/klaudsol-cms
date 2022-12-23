import RootContext from '@/components/contexts/RootContext';
import { useContext, useEffect, useState } from 'react';
import SkeletonContentBuilder from "@/components/klaudsolcms/skeleton/SkeletonContentBuilder";
import AppContentBuilderButtons from "@/components/klaudsolcms/buttons/AppContentBuilderButtons";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import { loadEntityType } from '@/components/reducers/actions';
import { slsFetch } from '@/components/Util'; 

const AppContentBuilderTable = ({typeSlug}) => {

   const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setModalVisible] = useState(false);
   const [currentAttribute, setCurrentAttribute] = useState();

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

    const onDeleteAttributeConfirmation = (attribute) => (evt) => {
      setModalVisible(true);
      setCurrentAttribute(attribute);
    };

    const onDeleteAttribute = (attribute) => (evt) => {
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
                          showEdit={false} 
                          onDelete={onDeleteAttributeConfirmation(attribute)} 
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
        </> 
    );
}
 
export default AppContentBuilderTable;