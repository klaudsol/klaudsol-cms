import Entity from "@/backend/models/core/Entity";
import { withSession } from "@klaudsol/commons/lib/Session";
import { handleRequests } from "@klaudsol/commons/lib/API";
import { assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { resolveValue } from "@/components/EntityAttributeValue";
import { downloadCSV } from "@/lib/Constants";
import { formatDataCSV } from "@/lib/downloadCSV";

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

  /**
   * Sample format of data:
   * [
   *   { 
   *     text: 'Hello', // if attribute is a normal text
   *     textarea: '- Data 1 \n' + // if attribute is a text area 
                   '- Data 2 \n' +
                   '- Data 3 \n' +
                   '- Data 4 \n',
          image: { // if attribute is an image
            name: 'qrcode.png',
            key: '4f96267b_qrcode.png',
            link: 'https://s3.amazonaws.com/eventurousintl-cms.stg.klaudsol.app/4f96267b_qrcode.png'
          }
        }
   *  ]
   * 
   */

  // Format content of CSV
  const csvContent = formatDataCSV(data);

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







