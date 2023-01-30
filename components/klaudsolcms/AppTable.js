import Link from 'next/link';
const AppTable = ({columns, entries, rows, entity_type_slug}) => {
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
                   <Link href={`/admin/content-manager/${entity_type_slug}/${row}`} passHref legacyBehavior key={index}><td key={index}> {entries.map((entry, ind) => (
                   <div key={ind}>
                      {entry.row_id === row && entry[col.accessor]}
                   </div>
                   ))} </td></Link>
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
