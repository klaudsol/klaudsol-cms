
const AppContentBuilderTable = ({columns, entries}) => {
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
                    {columns.map((col, index) => (
                        <td key={index}>{entry[col.accessor]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
        </> 
    );
}
 
export default AppContentBuilderTable;