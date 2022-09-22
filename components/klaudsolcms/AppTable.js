const AppTable = ({columns, entries}) => {
    return ( 
        <>
        <table id="table_general">
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
                    {columns.map(col => (
                        <td key={col.id}>
                            {entry[col.accessor]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
        </> 
    );
}
 
export default AppTable;