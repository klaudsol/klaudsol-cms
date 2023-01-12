import DB, { fromAurora, AURORA_TYPE } from '@backend/data_access/DB';
import UnauthorizedError from '@/components/errors/UnauthorizedError';
import AppNotEnabledError from '@/components/errors/AppNotEnabledError';
import InsufficientPermissionsError from '@/components/errors/InsufficientPermissionsError';
import { log } from '@/lib/Logger';
    
class Session {
  
  static fields()  {
    return {
      people_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true },
      sme_tenant_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
    };
  };

  static async getSession(session){ 
    if(!session) throw new UnauthorizedError('Session not found.');
    const db = new DB();
    const sql =  `SELECT people_id from sessions where session = :session AND session_expiry > NOW() LIMIT 1`;
    const data = await db.executeStatement(sql, [
      {name: 'session', value:{stringValue: session}},
    ]);
    
    if (data.records.length === 0) throw new UnauthorizedError('Session not found.');
     
    return data.records.map(([
      {longValue: people_id}
    ]) => ({
      people_id
    }))[0];
  }
  
  /**
   * assert({
   *  loggedIn: true,
   *  appsEnabled: ["trucking"],
   *  userHasPermission: ["manage"]
   * });
   * 
   * The goal is to resolve permission handling in the least amount of Aurora Data API requests.
   * 
   */
  
  static async assert(conditions, sessionToken) {
    
    if(!sessionToken) {
      throw new UnauthorizedError();  
    }
    
    let sql = '';
    let sqlArray = [];
    let params = {};
    let appsEnabledArray = [];
    let permissionsArray = [];
    const db = new DB();
    
    const isLoggedInSQL = `
      SELECT 'isLoggedIn' AS name, EXISTS(SELECT sessions.session FROM sessions 
      JOIN people ON sessions.people_id = people.id 
      WHERE 
        sessions.session = :session AND
        sessions.session IS NOT NULL AND
        sessions.session_expiry >= NOW() AND
        people.login_enabled = 1
      LIMIT 1) as value
      `;
      
    const appsEnabledSQL = `
      SELECT name, value FROM (select 'appsEnabled' AS name, count(sme_apps.slug) = :apps_count AS value from sme_sessions
      LEFT JOIN sme_tenants ON sme_tenants.id = sme_sessions.sme_tenant_id 
      LEFT JOIN sme_tenant_apps ON sme_tenant_apps.sme_tenant_id = sme_tenants.id
      LEFT JOIN sme_apps ON sme_tenant_apps.sme_app_id = sme_apps.id
      WHERE 
        sme_sessions.session = :session AND
        sme_apps.slug IN (:app1, :app2, :app3)
      ORDER BY sme_sessions.session_expiry DESC) table_apps_enabled 
    `;
    
    const userHasPermissionSQL = `
      SELECT name, value FROM (SELECT 'userHasPermission' AS name, count(sme_permissions.name) = :permissions_count AS value from sme_sessions 
        LEFT JOIN sme_people ON sme_sessions.people_id = sme_people.id
        LEFT JOIN sme_people_groups ON sme_people_groups.sme_people_id = sme_people.id AND sme_sessions.sme_tenant_id = sme_people_groups.sme_tenant_id
        LEFT JOIN sme_group_permissions ON sme_group_permissions.sme_group_id = sme_people_groups.sme_group_id AND sme_group_permissions.sme_tenant_id = sme_sessions.sme_tenant_id
        LEFT JOIN sme_permissions ON sme_group_permissions.sme_permission_id = sme_permissions.id
        WHERE 
          sme_sessions.session = :session AND
          sme_permissions.name IN (:permission1, :permission2, :permission3)
      ) table_user_has_permission;
    `;
    
    
    
    
    if(conditions.loggedIn) {
      sqlArray = [...sqlArray, isLoggedInSQL];
      params = {
        ...params,
        session: {name: 'session', value:{stringValue: sessionToken}}
      }
    }
    
    if(conditions.appsEnabled) {
      sqlArray = [...sqlArray, appsEnabledSQL];
      appsEnabledArray = Array.isArray(conditions.appsEnabled) ? conditions.appsEnabled : [conditions.appsEnabled];
      appsEnabledArray = [...new Set(appsEnabledArray)];  //remove duplicate entries.
      
      //The Aurora Data API does not support array parameters at the time of this writing.
      //As a workaround, we allow a maximum of 3 app dependencies.
      //Rewrite once array parameters are supported in the future.
      const app1 = appsEnabledArray[0];
      const app2 = appsEnabledArray[1] ?? app1;
      const app3 = appsEnabledArray[2] ?? app1;
      
      params = {
        ...params,
        session: {name: 'session', value:{stringValue: sessionToken}},
        appsCount: {name: 'apps_count', value:{longValue: appsEnabledArray.length}},
        app1: {name: 'app1', value:{stringValue: app1}}, 
        app2: {name: 'app2', value:{stringValue: app2}},
        app3: {name: 'app3', value:{stringValue: app3}},
      }
    }
    
    if(conditions.userHasPermission) {
      sqlArray = [...sqlArray, userHasPermissionSQL];
      permissionsArray = Array.isArray(conditions.userHasPermission) ? conditions.userHasPermission : [conditions.userHasPermission];
      permissionsArray = [...new Set(permissionsArray)];  //remove duplicate entries.      
      
      const permission1 = permissionsArray[0];
      const permission2 = permissionsArray[1] ?? permission1;
      const permission3 = permissionsArray[2] ?? permission1;
      
      params = {
        ...params,
        session: {name: 'session', value:{stringValue: sessionToken}},
        permissionsCount : {name: 'permissions_count', value:{longValue: permissionsArray.length}},
        permission1: {name: 'permission1', value:{stringValue: permission1}}, 
        permission2: {name: 'permission2', value:{stringValue: permission2}},
        permission3: {name: 'permission3', value:{stringValue: permission3}},
      }

    }
    
    sql = sqlArray.join(' UNION ');
    
    const rawData = await db.executeStatement(sql, Object.values(params));
    
    const data = Object.fromEntries(rawData.records.map(([{stringValue: key}, {longValue: value}]) => [key, value]));
    
    await log(JSON.stringify(rawData.records));
    await log(JSON.stringify(data));
    
    if (Object.keys(data).includes("isLoggedIn")) {
      if(data.isLoggedIn !== 1) {
        throw new UnauthorizedError();    
      }
    }
    
    if (Object.keys(data).includes("appsEnabled")) {
      if(data.appsEnabled !== 1) {
        throw new AppNotEnabledError(`One of the dependency apps is not enabled: ${conditions.appsEnabled.join(",")}`);  
      }  
    }
    
    if (Object.keys(data).includes("userHasPermission")) {
      if(data.userHasPermission !== 1) {
        throw new InsufficientPermissionsError(`You do not have one of the required permissions: ${permissionsArray.join(",")}`);  
      }  
    }
    
  }

  constructor(rawData) {
    Object.assign(this, rawData);
  };      
}

export default Session;
