import DB, { fromAurora, AURORA_TYPE, fieldsForSelect } from '@backend/data_access/DB';
import Session from '@backend/models/core/Session';
    
    class Settings {
      
        static fields()  {  
            return {
              sme_tenant_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
              tax: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
            };
          };
          
        static async displayTenantSettings(session) { // returns array of Timesheet Table
            const db = new DB();
            const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
            const sme_tenant_id = session_data.sme_tenant_id;
            const sql = `select sme_tenant_id, tax from sme_tenant_settings 
                         WHERE sme_tenant_id = :sme_tenant_id`;
            
            let executeStatementParam = [
              {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
            ];
                        
            const data = await db.exectuteStatement(sql, executeStatementParam);
           
            if (data.records.length === 0) {
              return null;
            } 
          
            const tenantSetingsRaw  = data.records;
            const tenantSettings = tenantSetingsRaw.map(settings => new Settings(fromAurora(settings, Settings.fields())));
            return tenantSettings;   
        }

      constructor(rawData) {
        Object.assign(this, rawData);
      };      
    }
    
    export default Settings;