
import DynamoDB from "@klaudsol/commons/lib/DynamoDB"
import { DYNAMO_DB_TYPES, DYNAMO_DB_INDEXES, DYNAMO_DB_TABLE } from "@/constants";

export default class Entity {
  // Gets all items where entity = entity_type_slug (eg. tech)
  // and if type = content
  // TODO: Add pagination
  // TODO: Add filtering
  // TODO: Add search
  static async whereAll({ entity_type_slug }) {
    const db = new DynamoDB();
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.entity_type_index,
      KeyConditionExpression: "#entity = :entity AND #type = :type",
      ExpressionAttributeNames: {
        "#entity": "entity",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":entity": { S: entity_type_slug },
        ":type": { S: DYNAMO_DB_TYPES.content },
      },
      ScanIndexForward: true
    };
    const result = await db.query(params);
    return result;
  }

  // Gets all the metadata included in the specific content_type
  // These are the attributes and variants
  static async whereMetadata({ entity_type_slug }) {
    const db = new DynamoDB();
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.entity_type_index,
      KeyConditionExpression: "#entity = :entity",
      FilterExpression: "#metadata = :metadataValue",
      ExpressionAttributeNames: {
        "#entity": "entity",
        "#metadata": "metadata",
      },
      ExpressionAttributeValues: {
        ":entity": { S: entity_type_slug },
        ":metadataValue": { BOOL: true },
      },
      ScanIndexForward: true
    };
    const result = await db.query(params);
    return result;
  }
}
