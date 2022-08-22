import DB, { fieldsForSelect, fieldsForInsert, fieldsForUpdate, fieldParametersForInsert, 
  executeStatementParamsForInsert, executeStatementParamsForUpdate,
  fromAurora, fromInsertAurora, fromDeleteAurora, 
  sanitizeData, AURORA_TYPE } from '@backend/data_access/DB';
import { serializeCurrency } from '@/components/GlobalConstants';

class TripTicket {
  
  static fields()  {
    return {
      id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false, allowOnUpdate: false}, 
      sme_company_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: false},
      encoded_by_person_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: false},
      date: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
      serial_number: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
      trucking_source_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true },
      trucking_destination_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
      trucking_driver_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
      trucking_driver_helper_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
      trucking_truck_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
      sme_customer_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}, 
      created_at: {auroraType: AURORA_TYPE.STRING, allowOnCreate: false, allowOnUpdate: false}, 
      price: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      sme_tenant_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}
    };
  };
  
  
  
  //returns array of TripTickets
  static async whereSession(session) {
    
    const db = new DB();
    
    //special case: price needs to be transformed, as it is stored as value x 1000
    //to prevent loss of precision during operations.
    const fields = Object.entries(TripTicket.fields()).map(([field, def]) => {
      switch(field) {
        case 'price':
          return 'app_trucking_trip_tickets.price / 1000 AS price';
        default:
          return `app_trucking_trip_tickets.${field}`
      }  
    });
    const sql = `SELECT ${fields.join(',')} FROM app_trucking_trip_tickets 
      LEFT JOIN sme_sessions ON app_trucking_trip_tickets.sme_tenant_id = sme_sessions.sme_tenant_id
      WHERE sme_sessions.session = :session ORDER BY date DESC, id DESC`;
      
    const data = await db.exectuteStatement(sql, [
      {name: 'session', value:{stringValue: session}}
    ]);
    
    
    const returnValue = data.records.map((record) => new TripTicket(fromAurora(record, TripTicket.fields())));
    return  returnValue;
  }
  
  //returns true or false
  static async destroy(companyId, id) {
    
    const db = new DB();
    const sql = `DELETE FROM app_trucking_trip_tickets WHERE sme_company_id = :sme_company_id AND id = :id`;
    const data = await db.exectuteStatement(sql, [
      {name: 'sme_company_id', value:{longValue: companyId}},
      {name: 'id', value:{longValue: id}}
    ]);
    
    return fromDeleteAurora(data);
  }
  
  //returns {id: 1}
  static async create(tripTicket) {
    const db = new DB();
    const sql = `INSERT INTO app_trucking_trip_tickets (${fieldsForInsert(TripTicket.fields())}) VALUES (${fieldParametersForInsert(TripTicket.fields())})`;
    //console.log(sql);
    //console.log(tripTicket);
    const paramsTransformer = (name, value) => ( name === 'price' ? `${serializeCurrency(value)}` : value);
    const executeStatementParams = executeStatementParamsForInsert(TripTicket.fields(), tripTicket, paramsTransformer);
    const data = await db.exectuteStatement(sql, executeStatementParams); 
    //console.log(data);
    const output = fromInsertAurora(data);
    //console.log(output);
    return output;
  }
  
  static async update(tripTicket) {
    const db = new DB();
    const sql = `UPDATE app_trucking_trip_tickets SET ${fieldsForUpdate(TripTicket.fields())} WHERE id = :id AND sme_company_id = :sme_company_id`;
    const paramsTransformer = (name, value) => ( name === 'price' ? `${serializeCurrency(value)}` : value);
    console.log(sql);
    const executeStatementParams = executeStatementParamsForUpdate(TripTicket.fields(), tripTicket, paramsTransformer);
    const data = await db.exectuteStatement(sql, [ 
      ...executeStatementParams,
      {name: 'sme_company_id', value:{longValue: tripTicket.sme_company_id}},
      {name: 'id', value:{longValue: tripTicket.id}}
    ]); 
    console.log(data);
  }
  
  constructor(rawData) {
    Object.assign(this, sanitizeData(rawData, TripTicket.fields()));
  };
  
}

export default TripTicket;