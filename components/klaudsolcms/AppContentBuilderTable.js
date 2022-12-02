import RootContext from '@/components/contexts/RootContext';
import { useContext, useEffect, useState } from 'react';
import SkeletonContentBuilder from "@/components/klaudsolcms/skeleton/SkeletonContentBuilder";

const AppContentBuilderTable = ({typeSlug}) => {

   const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
   const [loading, setLoading] = useState(false);

    useEffect(() => {
      (async () => {
        try {
          setLoading(true);
          const rawEntityType = await fetch(`/api/entity_types/${typeSlug}`);
          const entityType = await rawEntityType.json();
          if (rootState.entityType[typeSlug] && rootState.entityType[typeSlug]?.metadata?.hash === entityType.metadata.hash ) {
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

    const data = (typeSlug) => Object.entries(rootState.entityType[typeSlug]?.data ?? {});

    return ( 
        <>
          {data(typeSlug).length == 0 && loading && (
            <SkeletonContentBuilder />
          )}

          {data(typeSlug).length > 0 && (
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
                {data(typeSlug).map(([attributeName, attribute]) => (
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