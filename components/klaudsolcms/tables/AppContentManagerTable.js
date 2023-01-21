import Link from 'next/link';
const AppContentManagerTable = ({columns, entries, entity_type_slug}) => {
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
                        /* Would be nice if this was refactored to remove legacy behavior*/
                        <Link href={`/admin/content-manager/${entity_type_slug}/${entry.id}`} legacyBehavior passHref key={index}><td key={index}>{entry[col.accessor]}</td></Link>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
        </> 
    );
}
 
export default AppContentManagerTable;
