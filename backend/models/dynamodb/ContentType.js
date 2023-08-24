import DynamoDB from "@klaudsol/commons/lib/DynamoDB";
import { 
  DYNAMO_DB_TYPES, 
  DYNAMO_DB_INDEXES, 
  DYNAMO_DB_TABLE, 
} from "@/constants";
import { 
  formatAttributesData, 
  getOrganizationPK,
  getContentTypePK
} from "@/utils/dynamodb/formatResponse";

export default class ContentType {
  
  // Initialize DB
  static db = new DynamoDB();

  // Gets all the metadata included in the specific content_type
  // These are the attributes and variants
  // Note: Attributes are not yet sorted by order in the response
  static async find({ organization_slug, content_type_slug }) {
    const params = {
      TableName: DYNAMO_DB_TABLE,
      //IndexName: DYNAMO_DB_INDEXES.PK_slug_index,
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