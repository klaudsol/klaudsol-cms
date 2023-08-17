
import DynamoDB from "@klaudsol/commons/lib/DynamoDB"
import { DYNAMO_DB_TYPES, DYNAMO_DB_INDEXES, DYNAMO_DB_TABLE } from "@/constants";

export default class Entity {
  static async whereAll({ entity_type_slug }) {
    const db = new DynamoDB();
    const params = {
      TableName: DYNAMO_DB_TABLE,
      IndexName: DYNAMO_DB_INDEXES.entity_type_index,
      KeyConditionExpression: "#entity = :entity",
      ExpressionAttributeNames: {
        "#entity": "entity",
      },
      ExpressionAttributeValues: {
        ":entity": { S: entity_type_slug },
      },
    };
    const result = await db.query(params);
    return result;
  }
}