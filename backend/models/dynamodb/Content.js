
import DynamoDB from "@klaudsol/commons/lib/DynamoDB"
import { 
  DYNAMO_DB_TYPES, 
  DYNAMO_DB_INDEXES, 
  DYNAMO_DB_TABLE, 
} from "@/constants";
import RecordNotFound from "@klaudsol/commons/errors/RecordNotFound";
import { formatAttributesData, formatEntityTypeSlugResponse, getEntityVariant, getOrder, getOrganizationPK } from "@/utils/dynamodb/formatResponse";

export default class Content {
  // Initialize DB
  static db = new DynamoDB();

  // Gets all items under the content_type_slug and the organization_slug
  // Sample: api/myrza/blogs
  // Gets the content_type first based on its slug
  // Returns the PK and other needed attributes
  // Uses the PK to get all the items
  // TODO: Add pagination
  // TODO: Add filtering
  // TODO: Add search
  static async whereContentTypeSlug({ organization_slug, content_type_slug, order = null }) {
    // Gets all the content_type info based on the content_type_slug
    const { 
      contentTypePK, 
      contentTypeSK,
      contentTypeId, 
      contentTypeAttributes, 
      contentTypeVariant 
    } = await this.whereContentType({ organization_slug, content_type_slug });

    const SKPrefix = `${contentTypeSK.replaceAll('content_type', 'content')}`;
            
    const params = {
      TableName: DYNAMO_DB_TABLE,
      KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SKPrefix)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK" : "SK",
      },
      ExpressionAttributeValues: {
        ":PK": { S: contentTypePK },
        ":SKPrefix": { S: SKPrefix },
      },
      ScanIndexForward: getOrder(order)
    };

    const rawData = await this.db.query(params);
    const data = formatEntityTypeSlugResponse(rawData, contentTypeAttributes);

    const metadata = {
      attributes: contentTypeAttributes,
      content_type_id: contentTypeId,
      total_rows: rawData.Count,
      variant: contentTypeVariant
    };

    const output = {
      data, 
      metadata,
    }

    return output;
  }

  // Finds an item based on its content_type_slug and slug
  // Sample: api/tech/aws
  static async findByContentTypeSlugAndSlug({ organization_slug, content_type_slug, slug }) {
    const { 
      contentTypePK, 
      contentTypeSK,
      contentTypeId, 
      contentTypeAttributes, 
    } = await this.whereContentType({ organization_slug, content_type_slug });

    const contentSK = `${contentTypeSK.replaceAll('content_type', 'content')}/${slug}`;
      
    const params = {
      TableName: DYNAMO_DB_TABLE,
      KeyConditionExpression: "#PK = :PK AND #SK = :SK",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":PK": { S: contentTypePK },
        ":SK": { S: contentSK },
      },
      ScanIndexForward: true
    };
    const rawData = await this.db.query(params);
    if (rawData.Items.length === 0) throw new RecordNotFound();
    const data = Object.values(formatEntityTypeSlugResponse(rawData, contentTypeAttributes))[0];

    const metadata = {
      attributes: contentTypeAttributes,
      content_type: content_type_slug,
      content_type_id: contentTypeId,
    };

    const output = {
      data, 
      metadata,
    }

    return output;
  }

  // Gets all the metadata included in the specific content_type
  // These are the attributes and variants
  // Note: Attributes are not yet sorted by order in the response
  static async whereContentType({ organization_slug, content_type_slug }) {
    const organizationPK = getOrganizationPK(organization_slug);
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.PK_slug_index,
      KeyConditionExpression: "#PK = :PK AND #slug = :slug",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#slug": "slug",
      },
      ExpressionAttributeValues: {
        ":PK": { S: organizationPK },
        ":slug": { S: content_type_slug },
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
    const contentType = {
      contentTypePK, 
      contentTypeSK,
      contentTypeId, 
      contentTypeAttributes,
      contentTypeVariant,
    }
    return contentType;
  }
}
