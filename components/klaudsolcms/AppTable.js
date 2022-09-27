import Link from 'next/link';
const AppTable = ({columns, entries, rows}) => {
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
           {rows.map((row, i) => (
            <tr key={i}>
                {columns.map((col, index) => (
                   <td key={index}> {entries.map((entry, ind) => (
                   <div key={ind}>
                      {entry.row_id === row && <> {entry[col.accessor]} </>}
                   </div>
                   ))} </td>
                    ))
                }
            </tr>
           ))}
            </tbody>
        </table>
        </> 
    );
}
 
export default AppTable;