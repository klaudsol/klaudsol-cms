// Calls the downloadCSV api and downloads the file
export const handleDownloadCsv = async (apiUrl, setLoading) => {
  try {
    setLoading(true);
    const response = await fetch(apiUrl);
    if (response.ok) {
      const responseData = await response.json();
      const { filename, content } = responseData;
      // Initiates the file download
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      throw new Error('Error downloading data');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
}

export const formatDataCSV = (data) => {
  const csvHeaders = Object.keys(data[0]);
  const csvRows = data.map((item) => {
    const rowValues = Object.values(item).map((value) => {
      if (typeof value === 'object' && value !== null && 'link' in value) { // if attribute is an image
        return value.link;
      } else if (typeof value === 'string' && value.includes('\n')) { // if data has new lines (e.g. textarea)
        return `"${value.replace(/\n/g, ' ')}"`;
      }
      return value;
    });
    return rowValues;
  });
  const csvContent = `${csvHeaders.join(',')}\n${csvRows.map((row) => row.join(',')).join('\n')}`;

  return csvContent;
}