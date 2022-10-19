import AppContentBuilderButtons from "../buttons/AppContentBuilderButtons";

const SkeletonContentBuilder = () => {


    const columns = [
        {accessor: 'name', displayName: 'NAME'},
        {accessor: 'type', displayName: 'TYPE'},
        {accessor: 'button', displayName: ''},
    ]

    const entries = Array.from({length: 10}, (_, i) => {
        return {
            name: 'The data is still loading', 
            type: 'The data is still loading', 
            button:  <AppContentBuilderButtons isDisabled={true} /> 
        }
      })

    return ( 
        <>
        <table id="table_skeleton">
            {/*table head*/}
            <thead> 
                <tr>
                {columns.map((col, i) => (
                    <th key={i}>{col.displayName}</th>
                ))}
                </tr>
            </thead>
            {/*table body*/}
            <tbody>
            {entries.map((entry, i) => (
                <tr key={i}>
                    {columns.map((col, index) => (
                        <td key={index}><b className="skeleton-table-row">{entry[col.accessor]}</b></td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
        </> 
    );
}
 
export default SkeletonContentBuilder;