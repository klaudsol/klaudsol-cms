const SkeletonTable = () => {


    const columns = [
        {accessor: 'column_one_loading', displayName: 'column_one_loading'},
        {accessor: 'column_two_loading', displayName: 'column_two_loading'},
        {accessor: 'column_three_loading', displayName: 'column_three_loading'},
        {accessor: 'column_four_loading', displayName: 'column_four_loading'},
    ]

    const entries = Array.from({length: 10}, (_, i) => {
        return {
          column_one_loading: 'The data is still loading', 
          column_two_loading: 'The data is still loading', 
          column_three_loading: 'The data is still loading', 
          column_four_loading: 'The data is still loading', 
        }
      })

    return ( 
        <>
        <table id="table_skeleton">
            {/*table head*/}
            <thead> 
                <tr>
                {columns.map((col, i) => (
                    <th key={i}><b className="skeleton-table-header">{col.displayName}</b></th>
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
 
export default SkeletonTable;