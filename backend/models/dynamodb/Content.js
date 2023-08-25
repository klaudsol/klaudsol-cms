
import DynamoDB from "@klaudsol/commons/lib/DynamoDB";
import { 
  DYNAMO_DB_TABLE, 
  DYNAMO_DB_INDEXES
} from "@/constants";
import RecordNotFound from "@klaudsol/commons/errors/RecordNotFound";
import { 
  formatEntityTypeSlugResponse, 
  getOrder, 
  getOrganizationPK,
  getContentPK
} from "@/utils/dynamodb/formatResponse";

import ContentType from '@/backend/models/dynamodb/ContentType';

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
      contentTypeId, 
      contentTypeAttributes, 
      contentTypeVariant 
    } = await ContentType.find({ organization_slug, content_type_slug });

    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.organization_content_type_id_index,
      KeyConditionExpression: "#PK = :PK",
      ExpressionAttributeNames: {
        "#PK": "organization_content_type",
      },
      ExpressionAttributeValues: {
        ":PK": { S: `${organization_slug}/${content_type_slug}` },
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
      contentTypeId, 
      contentTypeAttributes, 
    } = await ContentType.find({ organization_slug, content_type_slug });

      
    const params = {
      TableName: DYNAMO_DB_TABLE,
      KeyConditionExpression: "#PK = :PK AND #SK = :SK",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":PK": { S: getOrganizationPK(organization_slug) },
        ":SK": { S: getContentPK(content_type_slug, slug) },
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

}
