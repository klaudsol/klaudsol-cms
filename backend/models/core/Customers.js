import DB, { fromAurora, AURORA_TYPE, fieldsForSelect } from '@backend/data_access/DB';
    
    class Customers {
      
      static fields()  {
        return {
          display_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
          full_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
          customer_address: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
          sme_customer_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
          is_default: {auroraType: AURORA_TYPE.BOOLEAN, allowOnCreate: true, allowOnUpdate: true},
          code: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
          rate: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        };
      };

      static async all({session}) { // returns array of Timesheet Table
        const db = new DB();
        const sql = `SELECT sme_customers.id, display_name, full_name, customer_address, code, rate, is_default from sme_customers 
                     INNER JOIN sme_people_customers ON sme_customers.id = sme_people_customers.sme_customer_id
                     INNER JOIN sme_sessions ON sme_sessions.people_id = sme_people_customers.sme_people_id 
                     WHERE sme_sessions.session = :session`;
        const data = await db.exectuteStatement(sql, [
          {name: 'session', value:{stringValue: session}},
        ]);
  
        return data.records.map(([
            {longValue: id},
            {stringValue: display_name},
            {stringValue: full_name},
            {stringValue: customer_address},
            {stringValue: code},
            {stringValue: rate},
            {booleanValue: is_default},
          ]) => ({
            id, display_name, full_name, customer_address, code, rate, is_default, 
            sme_customer_id: id                                         //Needed for backwards-compability. Remove this in the future  
          }));
      }
      
      constructor(rawData) {
        Object.assign(this, rawData);
      };      
    }
    
    export default Customers;