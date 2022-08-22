import DB from '@backend/data_access/DB';
import Session from '@backend/models/core/Session';

class Professional { 
    
    static async find({session, id}) { 
      const db = new DB();
      const session_data = await Session.getSession(session); 
      const sme_tenant_id = session_data.sme_tenant_id;

      const sql = `
        SELECT 
         sme_people.id, sme_people.first_name, sme_people.last_name, sme_people.company_position,
         sme_people.email, sme_people_professional.payment_to, sme_people_professional.code, sme_people_professional.rate
        FROM sme_people 
        LEFT JOIN sme_people_professional ON sme_people.id = sme_people_professional.sme_people_id
        WHERE sme_people.id = :id AND sme_people_professional.sme_tenant_id = :sme_tenant_id LIMIT 1
        `;

      let executeStatementParam = [
        {name: 'id', value:{longValue: id}},
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);

      return data.records.map(([
          {longValue: id},
          {stringValue: first_name},
          {stringValue: last_name},
          {stringValue: company_position},
          {stringValue: email},
          {stringValue: payment_to},
          {stringValue: code},
          {stringValue: rate},
          
        ]) => (
          {id, first_name, last_name, company_position, email, payment_to, code, rate}
      ))[0];
    }     
    
    static async all({session}) {
      const db = new DB();
      const session_data = await Session.getSession(session); 
      const sme_tenant_id = session_data.sme_tenant_id;
      const sql = `
        SELECT 
         sme_people.id, sme_people.first_name, sme_people.last_name, sme_people.company_position,
         sme_people.email, sme_people_professional.payment_to, sme_people_professional.code, sme_people_professional.rate
        FROM sme_people 
        LEFT JOIN sme_people_professional ON sme_people.id = sme_people_professional.sme_people_id
        WHERE sme_people_professional.sme_tenant_id = :sme_tenant_id
        `;

      let executeStatementParam = [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
      ];

      const data = await db.exectuteStatement(sql, executeStatementParam);

      return data.records.map(([
          {longValue: id},
          {stringValue: first_name},
          {stringValue: last_name},
          {stringValue: company_position},
          {stringValue: email},
          {stringValue: payment_to},
          {stringValue: code},
          {stringValue: rate},
          
        ]) => (
          {id, first_name, last_name, company_position, email, payment_to, code, rate}
      ));

    }
}

export default Professional;