import DB, { fieldsForSelect, fromAurora, AURORA_TYPE } from '@backend/data_access/DB';

import Session from '@backend/models/core/Session';
import { es } from 'date-fns/locale';

  class Timesheet {
    static fields()  {
      return {
        id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false, allowOnUpdate: false}, 
        start_time: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        end_time: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        duration: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
        description: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
        sme_people_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true },
        sme_tenant_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
        client_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
        first_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        last_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        client_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      };
    };

    static professionalFeeFields()  {
      return {
        payment_number: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        total_hours: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        rate: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
        gross_pay: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
        withholding_tax: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
        net_pay: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        average_hours: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        sme_people_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
      };
    };

   static professionalFeeEntriesFields()  {
      return {
        sme_tenant_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}, 
        app_timetracking_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}, 
        payment_number: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
      };
    };
    
    static invoicesFields()  {
      return {
        invoice_number: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
        rate: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        total_amount: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        coverage_start: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        coverage_end: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        sent_at: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        due_at: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      };
    };

    static bankFields()  {
      return {
        bank_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
        account_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        account_number: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        account_type: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      };
    };

    static invoiceEntriesFields()  {
      return {
        app_timetracking_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}, 
        app_timetracking_invoices_id: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
        start_time: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        end_time: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        duration: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        description: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        sme_people_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}, 
        client_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true}, 
        first_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        last_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        payment_to: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      };
    };

    

    static adjustmentsFields()  {
      return {
        invoice_number: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
        label: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true}, 
        man_hours: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
        description: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      };
    };



    /** Intended to be accessed by a normal user **/
    static async displayTimesheet({session, client_id, timerange}) { // returns array of Timesheet Table
      const db = new DB();
      const timezone = '+8:00'; // this determines the current timezone of the user. this will be dynamic in the future
      const client_sql = client_id ? 'AND app_timetracking.client_id = :client_id ' : '';
      const timerange_sql = timerange ? `AND CAST(CONVERT_TZ(start_time,'+00:00',:timezone) as date) = CAST(CONVERT_TZ(now(),'+00:00',:timezone) as date)` : '';
      const sql = `SELECT 
                  app_timetracking.*, sme_people.first_name, sme_people.last_name, sme_customers.display_name from app_timetracking 
                  INNER JOIN sme_sessions ON sme_sessions.sme_tenant_id = app_timetracking.sme_tenant_id 
                  AND sme_sessions.people_id = app_timetracking.sme_people_id
                  INNER JOIN sme_people ON sme_people.id = app_timetracking.sme_people_id  
                  INNER JOIN sme_customers ON sme_customers.id = app_timetracking.client_id 
                  WHERE sme_sessions.session = :session ${client_sql} ${timerange_sql} ORDER BY app_timetracking.start_time DESC`;
                  
      let executeStatementParam = [
        {name: 'session', value:{stringValue: session}},
        {name: 'timezone', value:{stringValue: timezone}},
      ];
      
      if (client_id) {
        executeStatementParam = [
          ...executeStatementParam,
          {name: 'client_id', value:{longValue: client_id}}
        ];
      } 
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((record) => new Timesheet(fromAurora(record, Timesheet.fields())));
    }
    
    /**Meant to be accessed by the workspace manager**/
    static async reports({session, client_id, timerange, peopleId, invoiceId}) { // returns array of Timesheet Table
      const db = new DB();
      const timezone = '+8:00'; // this determines the current timezone of the user. this will be dynamic in the future
      const clientSql = client_id ? 'AND app_timetracking.client_id = :client_id ' : '';
      const timerangeSql = timerange ? "AND CAST(CONVERT_TZ(start_time,'+00:00',:timezone) as date) = CAST(CONVERT_TZ(now(),'+00:00',:timezone) as date)" : '';
      const peopleSql = peopleId  ? 'AND sme_people.id = :peopleId ' : ''; 
      const invoiceSql = ((invoiceId) => {
        switch(invoiceId ?? '') {
          case "__invoiced__":
            return 'AND app_timetracking_invoice_entries.app_timetracking_id IS NOT NULL';
          case "__uninvoiced__":
            return 'AND app_timetracking_invoice_entries.app_timetracking_id IS NULL';
          case "":
            return '';
          default:
            return 'AND app_timetracking_invoice_entries.app_timetracking_invoices_id = :invoiceId';
        }  
      })(invoiceId);
      const sql = `SELECT 
                  app_timetracking.*, sme_people.first_name, sme_people.last_name, sme_customers.display_name from app_timetracking 
                  LEFT JOIN sme_sessions ON sme_sessions.sme_tenant_id = app_timetracking.sme_tenant_id 
                  LEFT JOIN sme_people ON sme_people.id = app_timetracking.sme_people_id  
                  LEFT JOIN sme_customers ON sme_customers.id = app_timetracking.client_id 
                  LEFT JOIN app_timetracking_invoice_entries ON 
                    app_timetracking.id = app_timetracking_invoice_entries.app_timetracking_id AND
                    app_timetracking.sme_tenant_id = app_timetracking_invoice_entries.sme_tenant_id
                  WHERE sme_sessions.session = :session ${clientSql} ${timerangeSql} ${peopleSql} ${invoiceSql} ORDER BY app_timetracking.start_time DESC`;
                  
      let executeStatementParam = {
        session: {name: 'session', value:{stringValue: session}},
        timezone: {name: 'timezone', value:{stringValue: timezone}},
        client_id: client_id ? {name: 'client_id', value:{longValue: client_id}} : null,
        peopleId: peopleId ? {name: 'peopleId', value:{longValue: peopleId}} : null,
        invoiceId: ['__invoiced__', '__uninvoiced__', '', null, undefined].includes(invoiceId) ? null : {name: 'invoiceId', value:{stringValue: invoiceId}}
      };
      
      const data = await db.exectuteStatement(sql, Object.values(executeStatementParam).filter(param => param));
     
      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((record) => new Timesheet(fromAurora(record, Timesheet.fields())));
    }
    
    /* These are the timesheet entries that 
     * - can be invoiced, and 
     * - have not been invoiced already.
     */

    static async invoicables({session, clientId, timerange}) {
      const db = new DB();
      const timezone = '+8:00'; // this determines the current timezone of the user. this will be dynamic in the future
      const clientSql = clientId ? 'AND app_timetracking.client_id = :client_id ' : '';
      const timerangeSql = timerange ? `AND CAST(CONVERT_TZ(start_time,'+00:00',:timezone) as date) = CAST(CONVERT_TZ(now(),'+00:00',:timezone) as date)` : '';
      const sql = `SELECT 
                  app_timetracking.id,
                  app_timetracking.start_time, app_timetracking.end_time, app_timetracking.duration,
                  app_timetracking.description, app_timetracking.sme_people_id, app_timetracking.sme_tenant_id,
                  app_timetracking.client_id,
                  sme_people.first_name, sme_people.last_name, sme_customers.display_name 
                  FROM app_timetracking 
                  INNER JOIN sme_sessions ON sme_sessions.sme_tenant_id = app_timetracking.sme_tenant_id 
                  INNER JOIN sme_people ON sme_people.id = app_timetracking.sme_people_id   
                  INNER JOIN sme_customers ON sme_customers.id = app_timetracking.client_id
                  LEFT JOIN app_timetracking_invoice_entries ON app_timetracking.sme_tenant_id = app_timetracking_invoice_entries.sme_tenant_id 
                  AND app_timetracking.id = app_timetracking_invoice_entries.app_timetracking_id 
                  WHERE sme_sessions.session = :session ${clientSql} ${timerangeSql} AND app_timetracking_invoice_entries.app_timetracking_id IS NULL ORDER BY app_timetracking.start_time ASC`;
                  
      let executeStatementParam = [
        {name: 'session', value:{stringValue: session}},
        {name: 'timezone', value:{stringValue: timezone}},
      ];
      
      if (clientId) {
        executeStatementParam = [
          ...executeStatementParam,
          {name: 'client_id', value:{longValue: clientId}}
        ];
      } 
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((
        [
          {longValue: id},
          {stringValue: start_time},
          {stringValue: end_time},
          {stringValue: duration},
          {stringValue: description},
          {longValue: sme_people_id},
          {longValue: sme_tenant_id},
          {longValue: client_id},
          {stringValue: first_name},
          {stringValue: last_name},
          {stringValue: display_name},
          
        ]
        ) => ({
          id, start_time, end_time, duration, description,
          sme_people_id, sme_tenant_id, client_id,
          first_name, last_name, display_name
      }));
    }


    static async displayInvoiceEntries(session, invoice_number) { // returns array of Timesheet Table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT app_timetracking_id, app_timetracking_invoices_id, start_time, end_time, duration, description, sme_people_id, client_id,
                   sme_people.first_name, sme_people.last_name
                   FROM app_timetracking_invoice_entries 
                   INNER JOIN sme_people ON sme_people.id = app_timetracking_invoice_entries.sme_people_id 
                   WHERE app_timetracking_invoice_entries.sme_tenant_id = :sme_tenant_id AND app_timetracking_invoice_entries.app_timetracking_invoices_id = :invoice_number
                   ORDER BY start_time ASC`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'invoice_number', value:{stringValue: invoice_number}},
      ];
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((
        [
          {longValue: app_timetracking_id},
          {longValue: app_timetracking_invoices_id},
          {stringValue: start_time},
          {stringValue: end_time},
          {stringValue: duration},
          {stringValue: description},
          {longValue: sme_people_id},
          {longValue: client_id},
          {stringValue: first_name},
          {stringValue: last_name}
        ]
        ) => ({
          app_timetracking_id,
          app_timetracking_invoices_id,
          start_time,
          end_time,
          duration,
          description,
          sme_people_id,
          client_id,
          first_name,
          last_name
        }));
    }

    static async displayBanks(session) { // returns array of Timesheet Table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT bank_name, account_name, account_number, account_type 
                   FROM app_timetracking_settings_banks where sme_tenant_id = :sme_tenant_id`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((record) => new Timesheet(fromAurora(record, Timesheet.bankFields())));
    }

    static async displayAdjustments(session, invoice_number) { // returns array of Timesheet Table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT invoice_number, label, man_hours, description 
                   FROM app_timetracking_invoice_adjustments 
                   WHERE sme_tenant_id = :sme_tenant_id AND invoice_number = :invoice_number`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'invoice_number', value:{stringValue: invoice_number}},
      ];
      
      const data = await db.exectuteStatement(sql, executeStatementParam);
     
      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((record) => new Timesheet(fromAurora(record, Timesheet.adjustmentsFields())));
    }

    static async onCreate({session, start_time, end_time, duration, client_id, description}) { // inserts time and description to app_timetracking table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const people_id = session_data.people_id;
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = start_time ? `INSERT into app_timetracking (start_time, end_time, duration, description, sme_people_id, sme_tenant_id, client_id) 
      VALUES (:start_time, :end_time, :duration, :description, :people_id, :sme_tenant_id, :client_id);` : `INSERT into app_timetracking (start_time, description, sme_people_id, sme_tenant_id, client_id) 
      VALUES (now(), :description, :people_id, :sme_tenant_id, :client_id);`
      
      let executeStatementParam = [
        {name: 'description', value:{stringValue: description}},
        {name: 'client_id', value:{longValue: client_id}},
        {name: 'people_id', value:{longValue: people_id}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];

      if (start_time) {
        executeStatementParam = [
          ...executeStatementParam,
          {name: 'start_time', value:{stringValue: start_time}},
          {name: 'end_time', value:{stringValue: end_time}},
          {name: 'duration', value:{stringValue: duration}},
        ];
      } 

      const data = await db.exectuteStatement(sql, executeStatementParam);
      return true;
    }

    static async onUpdate({session, id, client_id, start_time, end_time, duration, description}) { // records the end time and duration
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = end_time ? `UPDATE app_timetracking set start_time = :start_time, end_time = :end_time, duration = :duration, client_id = :client_id, description= :description WHERE id= :id AND sme_tenant_id = :sme_tenant_id` :
                             `UPDATE app_timetracking set end_time = now(), duration = (UNIX_TIMESTAMP(end_time) - UNIX_TIMESTAMP(start_time)) / (60.0 * 60.0) WHERE id= :id AND sme_tenant_id = :sme_tenant_id`
    
      let executeStatementParam = [
        {name: 'id', value:{longValue: id}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];

      if (end_time) {
        executeStatementParam = [
          ...executeStatementParam,
          {name: 'end_time', value:{stringValue: end_time}},
          {name: 'start_time', value:{stringValue: start_time}},
          {name: 'duration', value:{stringValue: duration}},
          {name: 'client_id', value:{longValue: client_id}},
          {name: 'description', value:{stringValue: description}},
        ];
      } 

      const data = await db.exectuteStatement(sql, executeStatementParam); 
      return true;
    }

    static async deleteRecord(session, id) { // deletes the record
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = `DELETE FROM app_timetracking WHERE id= :id
                   AND sme_tenant_id = :sme_tenant_id`;
      const data = await db.exectuteStatement(sql, [
        {name: 'id', value:{longValue: id}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ]);
      return true;
    }


    static async onCreateProfessionalFee({session, peopleId, paymentNumber, totalHours, developerRate, grossPay, tax, netPay, averageHours}) { 
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = `INSERT into app_timetracking_professional_fees (sme_tenant_id, sme_people_id, payment_number, total_hours, rate, gross_pay, withholding_tax, net_pay, average_hours) 
      VALUES (:sme_tenant_id, :sme_people_id, :payment_number, :total_hours, :rate, :gross_pay, :withholding_tax, :net_pay, :average_hours);` 
      
      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'sme_people_id', value:{longValue: peopleId}},
        {name: 'payment_number', value:{stringValue: paymentNumber}},
        {name: 'total_hours', value:{stringValue: totalHours}},
        {name: 'rate', value:{stringValue: developerRate}},
        {name: 'gross_pay', value:{stringValue: grossPay}},
        {name: 'withholding_tax', value:{stringValue: tax}},
        {name: 'net_pay', value:{stringValue: netPay}},
        {name: 'average_hours', value:{stringValue: averageHours}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);
      return true;
    }
    
    static async onCreateInvoiceAdjustments({session, invoice_number, label, man_hours, description}) { // inserts time and description to app_timetracking table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = `INSERT into app_timetracking_invoice_adjustments (sme_tenant_id, invoice_number, label, man_hours, description) 
                   VALUES (:sme_tenant_id, :invoice_number, :label, :man_hours, :description)` 
      
      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'invoice_number', value:{stringValue: invoice_number}},
        {name: 'label', value:{stringValue: label}},
        {name: 'man_hours', value:{stringValue: man_hours}},
        {name: 'description', value:{stringValue: description}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);
      return true;
    }



    static async displayProfessionalFeeEntries(session, payment_number) { // returns array of Timesheet Table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT app_timetracking_professional_fee_entries.*,
                   sme_people.first_name, sme_people.last_name, sme_people_professional.payment_to
                   FROM app_timetracking_professional_fee_entries 
                   INNER JOIN sme_people_professional ON sme_people_professional.sme_people_id = app_timetracking_professional_fee_entries.sme_people_id
                   INNER JOIN sme_people ON sme_people.id = app_timetracking_professional_fee_entries.sme_people_id
                   WHERE app_timetracking_professional_fee_entries.sme_tenant_id = :sme_tenant_id AND app_timetracking_professional_fee_entries.payment_number = :payment_number
                   ORDER BY start_time ASC`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'payment_number', value:{stringValue: payment_number}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);

      if (data.records.length === 0) {
        return null;
      } 

      return data.records.map((record) => new Timesheet(fromAurora(record, Timesheet.professionalFeeEntriesFields())));
    }

    static async onCreateProfessionalFeeEntries({session, peopleId, clientId, paymentNumber}) { // inserts time and description to app_timetracking table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = `insert into app_timetracking_professional_fee_entries
      (sme_tenant_id, app_timetracking_id, payment_number, start_time, end_time, duration, description, sme_people_id, client_id) 
      select :sme_tenant_id, id, :payment_number, start_time, end_time, duration, description, sme_people_id, client_id 
      from app_timetracking where sme_tenant_id=:sme_tenant_id AND client_id=:client_id AND sme_people_id = :sme_people_id order by start_time asc;` 
      
      let executeStatementParam = [
        {name: 'sme_people_id', value:{longValue: peopleId}},
        {name: 'client_id', value:{longValue: clientId}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        {name: 'payment_number', value:{stringValue: paymentNumber}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);
      return true;
    }


    constructor(rawData) {
      Object.assign(this, rawData);
    };
    
  }
  
  export default Timesheet;