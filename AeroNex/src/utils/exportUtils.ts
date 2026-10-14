export function exportToJson(data: any, filename: string) {
  try {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${filename}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (error) {
    console.error('Failed to export JSON:', error);
    return false;
  }
}

export function exportToCsv(items: Record<string, any>[], filename: string) {
  try {
    if (!items || items.length === 0) {
      alert('No data available to export.');
      return false;
    }

    const headers = Object.keys(items[0]);
    const csvRows = [
      headers.join(','),
      ...items.map(row =>
        headers
          .map(fieldName => {
            const val = row[fieldName];
            if (typeof val === 'object' && val !== null) {
              return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            }
            const stringVal = String(val ?? '');
            return `"${stringVal.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(csvRows.join('\n'))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (error) {
    console.error('Failed to export CSV:', error);
    return false;
  }
}
