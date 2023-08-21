
import DynamoDB from "@klaudsol/commons/lib/DynamoDB"
import { 
  DYNAMO_DB_TYPES, 
  DYNAMO_DB_INDEXES, 
  DYNAMO_DB_TABLE, 
} from "@/constants";
import RecordNotFound from "@klaudsol/commons/errors/RecordNotFound";
import { formatAttributesData, formatEntityTypeSlugResponse, getEntityVariant, getOrder } from "@/utils/dynamodb/formatResponse";

export default class Content {
  // Initialize DB
  static db = new DynamoDB();

  // Gets all items under the content_type_slug
  // Sample: api/tech
  // Gets the content_type first based on its slug
  // Returns the PK and other needed attributes
  // Uses the PK to get all the items
  // TODO: Add pagination
  // TODO: Add filtering
  // TODO: Add search
  static async whereContentTypeSlug({ content_type_slug, order = null }) {
    // Gets all the content_type info based on the content_type_slug
    const { 
      contentTypePK, 
      contentTypeId, 
      contentTypeAttributes, 
      contentTypeVariant 
    } = await this.whereContentType({ content_type_slug });
            
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.PK_type_index,
      KeyConditionExpression: "#PK = :PK AND #type = :type",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#type" : "type",
      },
      ExpressionAttributeValues: {
        ":PK": { S: contentTypePK },
        ":type": { S: DYNAMO_DB_TYPES.content },
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
  static async findByContentTypeSlugAndSlug({ content_type_slug, slug }) {
    const { 
      contentTypePK, 
      contentTypeId, 
      contentTypeAttributes, 
    } = await this.whereContentType({ content_type_slug });
      
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.PK_slug_index,
      KeyConditionExpression: "#PK = :PK AND #slug = :slug",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#slug": "slug",
      },
      ExpressionAttributeValues: {
        ":PK": { S: contentTypePK },
        ":slug": { S: slug },
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
  static async whereContentType({ content_type_slug }) {
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.slug_type_index,
      KeyConditionExpression: "#slug = :slug AND #type = :type",
      ExpressionAttributeNames: {
        "#slug": "slug",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":slug": { S: content_type_slug },
        ":type": { S: DYNAMO_DB_TYPES.content_type },
      },
      ScanIndexForward: true
    };
    const rawContentType = await this.db.query(params);
    if (rawContentType.Items.length === 0) throw new RecordNotFound();
    const contentTypePK = rawContentType.Items[0].PK.S;
    const contentTypeId = rawContentType.Items[0].id.S;
    const contentTypeVariant = getEntityVariant(rawContentType);

    const contentTypeAttributes = formatAttributesData(rawContentType.Items);
    const contentType = {
      contentTypePK, 
      contentTypeId, 
      contentTypeAttributes,
      contentTypeVariant
    }
    return contentType;
  }
}
