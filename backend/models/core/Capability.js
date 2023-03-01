import DB from "@backend/data_access/DB";
import InsufficientPermissionsError from "@/components/errors/InsufficientPermissionsError";

export default class Capability {
  static async getCapabilitiesByLoggedInUser(
    requiredCapabilities,
    session_token
  ) {
    const db = new DB();

    const sql = `SELECT DISTINCT capabilities.name from people_groups 
    LEFT JOIN groups ON groups.id = people_groups.group_id
    LEFT JOIN group_capabilities ON group_capabilities.group_id = groups.id
    LEFT JOIN capabilities ON capabilities.id = group_capabilities.capabilities_id
    WHERE people_groups.people_id IN (select people_id from sessions where session = :session_token) AND capabilities.name IS NOT NULL`;

    const rawCapabilites = await db.executeStatement(sql, [
      { name: "session_token", value: { stringValue: session_token } },
    ]);

    const userCapabilities = rawCapabilites.records.map(
      ([{ stringValue: capability }]) => capability
    );

    if (
      !Array.isArray(requiredCapabilities)
        ? !userCapabilities.includes(requiredCapabilities)
        : !requiredCapabilities.some((capability) =>
            userCapabilities.includes(capability)
          )
    ) {
      throw new InsufficientPermissionsError();
    }

    return true;
  }

  static async getCapabilitiesByGuest(requiredCapabilities) {
    const db = new DB();

    const sql = `SELECT DISTINCT capabilities.name FROM groups 
    LEFT JOIN group_capabilities ON group_capabilities.group_id = groups.id
    LEFT JOIN capabilities ON capabilities.id = group_capabilities.capabilities_id WHERE groups.name = "Guests"`;

    const rawCapabilites = await db.executeStatement(sql, []);

    const userCapabilities = rawCapabilites.records.map(
      ([{ stringValue: capability }]) => capability
    );

    if (
      !Array.isArray(requiredCapabilities)
        ? !userCapabilities.includes(requiredCapabilities)
        : !requiredCapabilities.some((capability) =>
            userCapabilities.includes(capability)
          )
    ) {
      throw new InsufficientPermissionsError();
    }

    return true;
  }
}
