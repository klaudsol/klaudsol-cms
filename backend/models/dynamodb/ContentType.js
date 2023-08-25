import DynamoDB from "@klaudsol/commons/lib/DynamoDB";
import { 
  DYNAMO_DB_TABLE, 
} from "@/constants";
import { 
  formatAttributesData, 
  getOrganizationPK,
  getContentTypePK
} from "@/utils/dynamodb/formatResponse";

export default class ContentType {

  static db = new DynamoDB();

  static async find({ organization_slug, content_type_slug }) {
    const params = {
      TableName: DYNAMO_DB_TABLE,
      KeyConditionExpression: "#PK = :PK AND #SK = :SK",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK"
      },
      ExpressionAttributeValues: {
        ":PK": { S: getOrganizationPK(organization_slug) },
        ":SK": { S: getContentTypePK(content_type_slug) },
      },
      ScanIndexForward: true
    };
    const rawContentType = await this.db.query(params);
    if (rawContentType.Items.length === 0) throw new RecordNotFound();
    const contentTypePK = rawContentType.Items[0].PK.S;
    const contentTypeSK = rawContentType.Items[0].SK.S;
    const contentTypeId = rawContentType.Items[0].id.S;
    const contentTypeVariant = rawContentType.Items[0].variant.S;

    const contentTypeAttributes = formatAttributesData(rawContentType.Items);

    return {
      contentTypePK, 
      contentTypeSK,
      contentTypeId, 
      contentTypeAttributes,
      contentTypeVariant,
    };
  }
}