import DB, { sha256, fieldsForSelect, fromAurora, sanitizeData, AURORA_TYPE } from '@backend/data_access/DB';


class Timezones{
    static fields()  {  
        return {
         id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false}, 
         timezones_country: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true }, 
         timezones_offset: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true }, 
        };
      };
    constructor(rawData) {
        Object.assign(this, sanitizeData(rawData, Timezones.fields()));
    };  

    static async displayTimezones(){
        const db = new DB();
        const sql = `SELECT * from sme_timezones`;
        const data = await db.exectuteStatement(sql);
         
          if (data.records.length === 0) {
            return null;
          } 

        return data.records.map((tz) => new Timezones(fromAurora(tz, Timezones.fields())));
    }
}

export default Timezones;