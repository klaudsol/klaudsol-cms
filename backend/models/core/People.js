import DB, { sha256, fieldsForSelect, fromAurora, sanitizeData, AURORA_TYPE } from '@backend/data_access/DB';
import { log } from '@/lib/Logger';
import UnauthorizedError from '@/components/errors/UnauthorizedError';
import Session from '@backend/models/core/Session';
import RecordNotFound from 'components/errors/RecordNotFound';
class People {
  
  //TODO: Maybe we can interrogate the database so that this becomes DRY-er?
  static fields()  {  
    return {
     id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false}, 
     first_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true }, 
     last_name: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true }, 
     role: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true }, 
     login_enabled: {auroraType: AURORA_TYPE.BOOLEAN, allowOnCreate: true }, 
     email: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true }, 
     created_at: {auroraType: AURORA_TYPE.STRING, allowOnCreate: false  }, 
    };
  };

 // fields for sme_people_professional 

/*
static async displayPeopleProfessional() { // returns array of Timesheet Table
  const db = new DB();
  const sql = `select * from sme_people_professional`;
              
  const data = await db.executeStatement(sql, []);
 
  if (data.records.length === 0) {
    return null;
  } 

  const peopleRaw  = data.records;
  const people = peopleRaw.map(person => new People(fromAurora(person, People.peopleProfessionalFields())));
  return people;   
}*/
  
  static async login(email, password) {
    try {
      
      const db = new DB();
      const sql = `SELECT id, salt, first_name, last_name, role FROM people 
        WHERE email=:email AND encrypted_password = sha2(CONCAT(:password, salt), 256) AND login_enabled = 1 LIMIT 1;`;
      const data = await db.executeStatement(sql, [
        {name: 'email', value:{stringValue: email}},
        {name: 'password', value:{stringValue: password}}
      ]);
      
      if (data.records.length === 0) {
        throw new UnauthorizedError("Invalid username and/or password.");
      } 
      
      const user = data.records[0]
      const [
        {longValue: userId},
        {stringValue: userSalt},
        {stringValue: firstName},
        {stringValue: lastName},
        {stringValue: role}
      ] = user;
      
      const session_token = sha256(`${userId}${userSalt}${Date.now()}`);
      
      const sessionSql = `INSERT INTO sessions (\`people_id\`, \`session\`, \`session_expiry\`)  
        VALUES(:id, :session, DATE_ADD(NOW(), INTERVAL 744 HOUR))`;
        
      await db.executeStatement(sessionSql, [
        {name: 'session', value:{stringValue: session_token}},
        {name: 'id', value:{longValue: userId}},
      ]);
      
      //Query available permissions
      let defaultEntityType, defaultEntityTypeData;
      const defaultEntityTypeSQL = `SELECT entity_types.slug from entity_types LIMIT 1`;
      defaultEntityTypeData = await db.executeStatement(defaultEntityTypeSQL, []);
      [{stringValue: defaultEntityType}] = defaultEntityTypeData.records[0];
 
      return { session_token, user: {firstName, lastName, role, defaultEntityType} };
      
    } catch (error) {
      log(error.stack);
      throw error; //throw error after logging so that the application handles the error
    }
    
  }

  static async displayCurrentUser(session) { // return User's information
    const db = new DB();
    const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
    const people_id = session_data.people_id;
    const sql = `select sme_people.id, sme_people.first_name, sme_people.last_name, sme_people.company_position, 
                  sme_people.login_enabled, sme_people.email, sme_people.created_at, sme_people.sme_timezone_id, 
                  sme_people.sme_tenant_id, sme_timezones.timezones_country, sme_timezones.timezones_offset
                  FROM sme_people 
                  LEFT JOIN sme_timezones 
                  ON sme_people.sme_timezone_id = sme_timezones.id
                  WHERE sme_people.id = :people_id AND
                  sme_people.sme_tenant_id = :sme_tenant_id
                  LIMIT 1`;
                  
    const data = await db.executeStatement(sql, [
      {name: 'people_id', value:{longValue: people_id}},
      {name: 'sme_tenant_id', value:{longValue: session_data.sme_tenant_id}},
    ]);
    
    if (data.records.length === 0) {
      return null;
    } 

    return new People(fromAurora(data.records[0], People.fields()))
  }


  //TODO: Remove password change here.
  static async updateUserInfo({id, first_name, last_name, email, oldPassword, newPassword, sme_timezone_id}){
    const db = new DB();
      const encryptedPasswordPhrase =  newPassword ? 'encrypted_password = sha2(CONCAT(:newPassword, salt), 256),' : '';
      const updateSql =  `UPDATE sme_people set first_name = :first_name, last_name = :last_name, email = :email, ${encryptedPasswordPhrase} sme_timezone_id = :sme_timezone_id WHERE id = :id`;
      const checkPasswordSql = `SELECT * FROM sme_people 
                                where id = :id AND encrypted_password = sha2(CONCAT(:oldPassword, salt), 256) LIMIT 1`;
      
      // !oldPassword/!newPassword is not working.
      // Validations for updating password
      if (oldPassword || newPassword){
        const sqlPass = await db.executeStatement(checkPasswordSql, [
          {name: 'id', value: {longValue: id}},
          {name: 'oldPassword', value:{stringValue: oldPassword}}
        ]);
        if (sqlPass.records.length === 0) {
          throw new RecordNotFound("Incorrect password");
        }
      }

      const executeStatementParam = {
        id: {name: 'id', value: {longValue: id}},
        first_name: {name: 'first_name', value: {stringValue: first_name}},
        last_name: {name: 'last_name', value: {stringValue: last_name}},
        email: {name: 'email', value: {stringValue: email}},
        newPassword: {name: 'newPassword', value: {stringValue: newPassword}},
        sme_timezone_id: {name: 'sme_timezone_id', value: {longValue: sme_timezone_id}}
      }

      if(!newPassword) delete executeStatementParam.newPassword;

      const data = await db.executeStatement(updateSql, Object.values(executeStatementParam)); 
      return true;
      
  }

  //A password changer needs a method of its own for security purposes
  static async updatePassword({id, oldPassword, newPassword}){

    //early exit if the old password or the new password is not provided.
    if (!oldPassword || !newPassword) throw new Error('Passwords are required.');

    const db = new DB();

    //TODO: for security reasons, replace the salt as well for every password change.
    const updateSql =  `
    UPDATE people  
    SET
      encrypted_password = sha2(CONCAT(:newPassword, salt), 256) 
    WHERE id = :id`;

    //Check if the provided oldPassword is correct.
    const checkPasswordSql = `SELECT id FROM people 
                              WHERE id = :id AND encrypted_password = sha2(CONCAT(:oldPassword, salt), 256) AND login_enabled = 1  LIMIT 1`;
      
    const sqlPass = await db.executeStatement(checkPasswordSql, [
      {name: 'id', value: {longValue: id}},
      {name: 'oldPassword', value:{stringValue: oldPassword}}
    ]);
    if (sqlPass.records.length === 0) {
      throw new RecordNotFound("Incorrect password");
    }

    const executeStatementParam = [
      {name: 'id', value: {longValue: id}},
      {name: 'newPassword', value: {stringValue: newPassword}},
    ];

    const data = await db.executeStatement(updateSql, executeStatementParam); 
    return true;
      
  }
  
  
  //TODO: Refactor to models/Session
  
  static async logout(session_token) {
    try {
      const db = new DB();
      const sessionSql = "DELETE FROM sme_sessions WHERE `session` = :session";
      await db.executeStatement(sessionSql, [
        {name: 'session', value:{stringValue: session_token}},
      ]);
      return true;
    } catch (ex) {
      console.error(ex);  
      return false;
    }
    
  }
  
  //This is deprecated. Use Session.assert instead.
  
  static async isSessionAlive(session_token) {
    const db = new DB();
    const sql = `SELECT sme_sessions.session FROM sme_sessions JOIN people ON sme_sessions.people_id = sme_people.id WHERE 
      sme_sessions.session = :session AND
      sme_sessions.session_expiry >= NOW() AND
      sme_people.login_enabled = 1 
    `;  
    try {
      const data = await db.executeStatement(sql, [
        {name: 'session', value:{stringValue: session_token}},
      ]);
      
      return data.records.length > 0; 
      
    } catch (ex) {
      console.error(ex);  
      return false;
    }
  }
  
  static async findBySession(session) {
    
    try {
      
      const db = new DB();
      
      //TODO: We need to think on how to do joins elegantly.
      //Is it time to use an ORM? Is it worth the effort?
      const fields = [
        ...Object.keys(People.fields()).map(key => `sme_people.${key}`),
        'sme_tenants.homepage'
        ];
      const sql = `SELECT ${fields.join(',')} FROM sme_sessions 
        JOIN sme_people ON sme_sessions.people_id = sme_people.id 
        JOIN sme_tenants ON sme_sessions.sme_tenant_id = sme_tenants.id
        WHERE 
        sme_sessions.session = :session AND
        sme_sessions.session_expiry >= NOW() AND
        sme_people.login_enabled = 1 
        LIMIT 1
      `;  
      
      const data = await db.executeStatement(sql, [
        {name: 'session', value:{stringValue: session}},
      ]);
      
      
      const person_raw = data.records[0];
      
      //fields not in the people table, as it is a join. How to do this elegantly?
      const SME_TENANTS_HOMEPAGE = 0;
      const sme_tenants_homepage = person_raw[Object.keys(People.fields()).length + SME_TENANTS_HOMEPAGE]?.stringValue;
      
      const person = new People(fromAurora(person_raw, People.fields()));
      //again, how do we do relationships elegantly?
      person.tenant = {homepage: sme_tenants_homepage };
      return person; 
      
    } catch (ex) {
      log(ex.stack);  
      return false;
    }
  }
  
  
  //Let the controller handle the exceptions
  static async all(session) {
      const db = new DB();
      
      const fields = [
        ...Object.keys(People.fields()).map(key => `sme_people.${key}`)
        ];
        
      const sql = `SELECT ${fields.join(',')} FROM sme_people_tenants
        LEFT JOIN sme_people ON sme_people_tenants.sme_people_id = sme_people.id 
        LEFT JOIN sme_sessions ON sme_people_tenants.sme_tenant_id = sme_sessions.sme_tenant_id
        WHERE 
          sme_sessions.session = :session AND
          sme_sessions.session_expiry >= NOW()
        ORDER BY first_name ASC
      `;  
      
      const data = await db.executeStatement(sql, [
        {name: 'session', value:{stringValue: session}},
      ]);
      
      const peopleRaw  = data.records;
      const people = peopleRaw.map(person => new People(fromAurora(person, People.fields())));
      return people;   
  }

  static peopleProfessionalFields()  {  
    return {
      sme_people_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
      payment_to: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
      code: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true },
      rate: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true, allowOnUpdate: true},
    };
  };


  static async displayPeopleProfessional(session) { // returns array of Timesheet Table
    const db = new DB();
    const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
    const sme_tenant_id = session_data.sme_tenant_id;
    const sql = `select sme_people_id, payment_to, code, rate from sme_people_professional 
                 WHERE sme_tenant_id = :sme_tenant_id`;
    
    let executeStatementParam = [
      {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
    ];
                
    const data = await db.executeStatement(sql, executeStatementParam);
   
    if (data.records.length === 0) {
      return null;
    } 
  
    const peopleRaw  = data.records;
    const people = peopleRaw.map(person => new People(fromAurora(person, People.peopleProfessionalFields())));
    return people;   
  }

  constructor(rawData) {
    Object.assign(this, rawData);
  };
    
  
  displayName() {
    return `${this.first_name}`;
  }
  
}

export default People;