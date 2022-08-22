import DB from '@backend/data_access/DB';
import Session from '@backend/models/core/Session';


export default class InvoiceEntry {
    static async where({session, invoice_number = null, sme_people_id = null}) { 
      const db = new DB();
      const sessionData = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const tenantId = sessionData.sme_tenant_id;

      const invoiceNumberSql = invoice_number ? 'app_timetracking_invoices_id = :invoice_number' : 'TRUE';
      const peopleIdSql = sme_people_id ? 'sme_people_id = :sme_people_id' : 'TRUE';
      const sql = `
        select app_timetracking_id, app_timetracking_invoices_id, start_time, end_time, duration, description, sme_people_id, client_id  
      from app_timetracking_invoice_entries WHERE ${invoiceNumberSql} AND ${peopleIdSql} ORDER BY start_time ASC;`;

      const executeStatementParam = { 
        sme_tenant_id: {name: 'sme_tenant_id', value:{longValue: tenantId}},
        invoice_number: {name: 'invoice_number', value:{stringValue: invoice_number}},
        sme_people_id: {name: 'sme_people_id', value:{longValue: sme_people_id}}
      };
      
      if(!invoice_number) delete executeStatementParam.invoice_number;
      if(!sme_people_id) delete executeStatementParam.sme_people_id;
      
      const data = await db.exectuteStatement(sql, Object.values(executeStatementParam));
     
      return data.records.map(([
        {longValue: app_timetracking_id},
        {stringValue: invoice_number},
        {stringValue: start_time},
        {stringValue: end_time},
        {stringValue: duration},
        {stringValue: description},
        {longValue: sme_people_id},
        {longValue: sme_client_id}
      ]) => ({
          app_timetracking_id, invoice_number, start_time, end_time, duration, description, sme_people_id, sme_client_id 
      }));
    }
  
}