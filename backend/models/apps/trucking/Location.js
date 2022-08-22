import DB, { fieldsForSelect, fromAurora, sanitizeData, AURORA_TYPE } from '@sme_data_access/DB';

class Location {
  
  static fields()  {
    return {
      id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false, allowOnUpdate: false}, 
      sme_company_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: false},
      name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      created_at: {auroraType: AURORA_TYPE.STRING, allowOnCreate: false, allowOnUpdate: false}, 
    };
  };
  
  static async whereCompanyId(companyId) {
    
    const db = new DB();
    const sql = `SELECT ${fieldsForSelect('trucking_locations', Location.fields())} FROM trucking_locations WHERE sme_company_id = :sme_company_id ORDER BY name ASC, id DESC`;
    const data = await db.exectuteStatement(sql, [
      {name: 'sme_company_id', value:{longValue: companyId}}
    ]);
    
    return data.records.map((record) => new Location(fromAurora(record, Location.fields())));
  }
  
  constructor(rawData) {
    Object.assign(this, sanitizeData(rawData, Location.fields()));
  };
  
  
}

export default Location;