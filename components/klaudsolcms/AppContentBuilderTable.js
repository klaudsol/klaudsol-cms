import RootContext from '@/components/contexts/RootContext';
import { useContext, useEffect, useState } from 'react';
import SkeletonContentBuilder from "@/components/klaudsolcms/skeleton/SkeletonContentBuilder";

const AppContentBuilderTable = ({typeSlug}) => {

   const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
   const [loading, setLoading] = useState(false);

   const data = ({rootState, typeSlug}) => Object.entries(rootState.entityType[typeSlug]?.data ?? {});
   const hasHash = ({rootState, typeSlug}) => rootState.entityType[typeSlug]?.metadata?.hash;
   const hashEqualTo = ({rootState, typeSlug, hash}) => rootState.entityType[typeSlug]?.metadata?.hash === hash;

    useEffect(() => {
      (async () => {
        try {
          setLoading(true);
          //refactor to reducers/actions
          const rawEntityType = await fetch(`/api/entity_types/${typeSlug}`);
          const entityType = await rawEntityType.json();
          if (rootState.entityType[typeSlug] && hashEqualTo({typeSlug, hash: entityType.metadata.hash})) {
            setLoading(false);
            //use cache, do nothing
          } else {
            rootDispatch({type: 'SET_ENTITY_TYPE', payload: {slug: typeSlug, entityType}});
          }
        } catch(error) {
          //do nothing for now
        } finally {
          setLoading(false);
        }
      })();
    }, [typeSlug]);


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
                    </tr>
                </thead>
                {/*table body*/}
                <tbody>
                {data({rootState, typeSlug}).map(([attributeName, attribute]) => (
                    <tr key={attributeName}>
                      <td>{attributeName}</td>
                      <td>{attribute.type}</td>
                      <td>{attribute.order}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          )}
        </> 
    );
}
 
export default AppContentBuilderTable;