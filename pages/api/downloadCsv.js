import Entity from "@/backend/models/core/Entity";
import { withSession } from "@klaudsol/commons/lib/Session";
import { handleRequests } from "@klaudsol/commons/lib/API";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { resolveValue } from "@/components/EntityAttributeValue";
import { downloadCSV } from "@/lib/Constants";

export default withSession(handleRequests({ get }));

async function get(req, res) {
  await assertUserCan(downloadCSV, req);
  const { entity_type_slug, ...queries } = req.query;

  const rawData = await Entity.where(
    { entity_type_slug, entry: null, page: null },
    queries
  );

  const initialFormat = {
    indexedData: {},
  };

  const dataTemp = rawData.data.reduce((collection, item) => {
    return {
      indexedData: {
        ...collection.indexedData,
        [item.id]: {
          ...collection.indexedData[item.id],
          ...(!collection.indexedData[item.id]?.id && { id: item.id }),
          ...(!collection.indexedData[item.id]?.slug && {
            slug: item.entities_slug,
          }),
          ...(!collection.indexedData[item.id]?.[item.attributes_name] && {
            [item.attributes_name]: resolveValue(item),
          }),
        },
      },
    };
  }, initialFormat);
  
  const data = Object.values(dataTemp.indexedData);

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

  const timestamp = new Date().getTime();;
  const filename = `${entity_type_slug}_${timestamp}.csv`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Length', Buffer.byteLength(csvContent));

  const response = {
    filename,
    content: csvContent,
  };

  res.status(200).json(response);
}







