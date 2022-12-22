import RootContext from '@/components/contexts/RootContext';
import { useContext, useEffect, useState } from 'react';
import SkeletonContentBuilder from "@/components/klaudsolcms/skeleton/SkeletonContentBuilder";
import { loadEntityType } from '@/components/reducers/actions';

const AppContentBuilderTable = ({typeSlug}) => {

   const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
   const [loading, setLoading] = useState(false);

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