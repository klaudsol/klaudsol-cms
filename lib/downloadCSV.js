import json2csv from 'json2csv';

// Converts table to CSV
export const convertToCsv = (table) => {
  const headers = Array.from(table.rows[0].cells).map(cell => cell.innerText);
  
  const rows = Array.from(table.rows).slice(1).map(row =>
    Array.from(row.cells).reduce((acc, cell, index) => {
      const header = headers[index];
      return { ...acc, [header]: cell.innerText };
    }, {})
  );
  
  const csv = json2csv.parse(rows);
  return csv;
}
  
// Downloads table
export const handleDownloadCsv = (title, tableRef) => {
  const table = tableRef.current;
  const csv = convertToCsv(table);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}-table.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};