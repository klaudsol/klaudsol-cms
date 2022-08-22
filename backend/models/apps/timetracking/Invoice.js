import DB from '@backend/data_access/DB';
import Session from '@backend/models/core/Session';


export default class Invoice {
  
    //TODO: Wrap these statements in a transaction
    static async create({session, invoiceNumber, client_id, rate, total_amount, coverage_start, coverage_end, sent_at, due_at, ids}) { // inserts time and description to app_timetracking table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = `INSERT into app_timetracking_invoices (sme_tenant_id, invoice_number, rate, total_amount, coverage_start, coverage_end, sent_at, due_at) 
      VALUES (:sme_tenant_id, :invoice_number, :rate, :total_amount, :coverage_start, :coverage_end, :sent_at, :due_at);` 
      
      let executeStatementParam = [
        {name: 'invoice_number', value:{stringValue: invoiceNumber}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'rate', value:{stringValue: rate}},
        {name: 'total_amount', value:{stringValue: total_amount}},
        {name: 'coverage_start', value:{stringValue: coverage_start}},
        {name: 'coverage_end', value:{stringValue: coverage_end}},
        {name: 'sent_at', value:{stringValue: sent_at}},
        {name: 'due_at', value:{stringValue: due_at}},
      ];

      await db.exectuteStatement(sql, executeStatementParam);
      
      const sanitizedIds = ids.map(id => parseInt(id, 10)); 

      const entriesSql = `insert into app_timetracking_invoice_entries
                    (sme_tenant_id, app_timetracking_id, app_timetracking_invoices_id,start_time, end_time, duration, description, sme_people_id, client_id) 
                    select :sme_tenant_id, app_timetracking.id, :invoice_number, app_timetracking.start_time, app_timetracking.end_time, app_timetracking.duration, app_timetracking.description, app_timetracking.sme_people_id, app_timetracking.client_id 
                    from app_timetracking INNER JOIN sme_sessions ON sme_sessions.sme_tenant_id = app_timetracking.sme_tenant_id 
                    INNER JOIN sme_people ON sme_people.id = app_timetracking.sme_people_id   
                    INNER JOIN sme_customers ON sme_customers.id = app_timetracking.client_id
                    LEFT JOIN app_timetracking_invoice_entries ON app_timetracking.sme_tenant_id = app_timetracking_invoice_entries.sme_tenant_id 
                    AND app_timetracking.id = app_timetracking_invoice_entries.app_timetracking_id 
                    WHERE 
                    app_timetracking.id IN (${sanitizedIds.join(',')}) AND
                    sme_sessions.session = :session AND app_timetracking.client_id = :client_id AND app_timetracking_invoice_entries.app_timetracking_id IS NULL ORDER BY app_timetracking.start_time ASC;`
                    
      console.error(entriesSql);

      let executeEntriesStatementParam = [
        {name: 'client_id', value:{longValue: client_id}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'invoice_number', value:{stringValue: invoiceNumber}},
        {name: 'session', value:{stringValue: session}}
      ];

      await db.exectuteStatement(entriesSql, executeEntriesStatementParam);
      
      
      return true;
    }
    
    
    static async all({session}) { 
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT invoice_number, rate, total_amount, coverage_start, coverage_end, sent_at, due_at 
                   FROM app_timetracking_invoices where sme_tenant_id = :sme_tenant_id ORDER BY invoice_number DESC`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      return data.records.map(([
        {stringValue: invoice_number},
        {stringValue: rate},
        {stringValue: total_amount},
        {stringValue: coverage_start},
        {stringValue: coverage_end},
        {stringValue: sent_at},
        {stringValue: due_at}
      ]) => ({
        invoice_number, rate, total_amount, coverage_start, sent_at, due_at  
      }));
    }
    
    
    static async find({session, invoiceNumber}) {
       const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT invoice_number, total_hours, rate, total_amount, coverage_start, coverage_end, sent_at, due_at 
                   FROM app_timetracking_invoices where sme_tenant_id = :sme_tenant_id AND invoice_number = :invoice_number LIMIT 1`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'invoice_number', value:{stringValue: invoiceNumber}},
      ];
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      return data.records.map(([
        {stringValue: invoice_number},
        {stringValue: total_hours},
        {stringValue: rate},
        {stringValue: total_amount},
        {stringValue: coverage_start},
        {stringValue: coverage_end},
        {stringValue: sent_at},
        {stringValue: due_at}
      ]) => ({
        invoice_number, total_hours, rate, total_amount, coverage_start, coverage_end, sent_at, due_at  
      }))[0];     
    }
  
}
