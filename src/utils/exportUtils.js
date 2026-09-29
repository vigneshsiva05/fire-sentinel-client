export const exportToCSV = (data, filename = 'satellite_fire_report.csv') => {
  if (!data || !data.length) return;

  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(','),
    ...data.map((row) =>
      keys
        .map((key) => {
          let val = row[key];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'object') val = JSON.stringify(val).replace(/"/g, '""');
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'satellite_fire_report.json') => {
  if (!data) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
