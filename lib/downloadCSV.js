// Calls the downloadCSV api and downloads the file
export const handleDownloadCsv = async (entity_type_slug, setLoading) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/downloadCsv?entity_type_slug=${entity_type_slug}`);
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