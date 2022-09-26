import Link from 'next/link';
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
                    {columns.map((col, index) => (
                        <Link key={index} href={`/admin/content-manager/type/${entry['id']}`} passHref><td>{entry[col.accessor]}</td></Link>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
        </> 
    );
}
 
export default AppTable;