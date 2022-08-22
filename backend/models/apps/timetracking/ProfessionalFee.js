import DB from '@backend/data_access/DB';
import Session from '@backend/models/core/Session';

class ProfessionalFee {

    static async all(session) { // returns array of Timesheet Table
      const db = new DB();
      const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `SELECT payment_number, total_hours, rate, gross_pay, withholding_tax, net_pay, average_hours, sme_people_id
                   FROM app_timetracking_professional_fees where sme_tenant_id = :sme_tenant_id ORDER BY payment_number DESC`;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);

      return data.records.map(([
          {stringValue: payment_number},
          {stringValue: total_hours},
          {stringValue: rate},
          {stringValue: gross_pay},
          {stringValue: withholding_tax},
          {stringValue: net_pay},
          {stringValue: average_hours},
          {longValue: sme_people_id},
          
        ]) => (
          {payment_number, total_hours, rate, gross_pay, withholding_tax, net_pay, average_hours, sme_people_id}
      ));
    }
    
    
};

export default ProfessionalFee;