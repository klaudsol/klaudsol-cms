import DB, { fieldsForSelect, fieldsForInsert, fieldsForUpdate, fieldParametersForInsert, 
    executeStatementParamsForInsert, executeStatementParamsForUpdate,
    fromAurora, fromInsertAurora, fromDeleteAurora, 
    sanitizeData, AURORA_TYPE } from '@backend/data_access/DB';
    import Session from '@backend/models/core/Session';

    class Survey{
      
      static fields(){
        return{
          id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false, allowOnUpdate: false}, 
          questions: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true},
          options_image: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true},
          options_value: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true},
          sme_people_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true },
          sme_tenant_id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: true, allowOnUpdate: true},
        }
      }
      static surveyID()  {
        return {
         id: {auroraType: AURORA_TYPE.LONG, allowOnCreate: false}, 
        };
      };

      static questions(){
        return{
          questions: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true}
        }
      }
      static options(){
        return{
          options_image: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true},
          options_value: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true},
        }
      }
      static answers(){
        return{
          answer: {auroraType: AURORA_TYPE.STRING, allowOnCreate: true},
          
        }
      }
   
      static async displayPresidentialPoll(session) {
        const db = new DB();
        const session_data = await Session.getSession(session);
        const sme_tenant_id = session_data.sme_tenant_id;
        const sql =`SELECT questions FROM app_surveyforms_questions
                    WHERE app_surveyforms_id = 1
                    AND sme_tenant_id = :sme_tenant_id`;
        const data_questions = await db.exectuteStatement(sql, [
        {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}}
        ]);
        return data_questions.records.map((record) => new Survey(fromAurora(record, Survey.questions())));
      }
  
      static async displayPresidentialPollOptions(session) {
        const db = new DB();
        const session_data = await Session.getSession(session);
        const sme_tenant_id = session_data.sme_tenant_id;
        const sql = `SELECT options_image, options_value FROM app_surveyforms_options
                      WHERE app_surveyforms_questions_id = 1 
                      AND sme_tenant_id = :sme_tenant_id`;
        const data_options = await db.exectuteStatement(sql, [
          {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}}
        ]);
        return data_options.records.map((record) => new Survey(fromAurora(record, Survey.options())));
      }
      

      static async recordSurvey(answer, session) {
        const db = new DB();
        const session_data = await Session.getSession(session);
        const people_id = session_data.people_id;
        const sme_tenant_id = session_data.sme_tenant_id;
        const sql =  `insert into app_surveyforms_response (sme_people_id, app_surveyforms_id, app_surveyforms_questions_id, app_surveyforms_options_id,  sme_tenant_id) 
        values (:people_id, 1, (select id from app_surveyforms_questions where app_surveyforms_id = 1),(select id from app_surveyforms_options where options_value = :answer), :sme_tenant_id);`;
        
        const data = await db.exectuteStatement(sql, [
          {name: 'answer', value:{stringValue: answer}},
          {name: 'people_id', value:{longValue: people_id}},
            {name: 'sme_tenant_id', value:{longValue: sme_tenant_id}},
        ]);
        return true;
      }
    
      constructor(rawData) {
        Object.assign(this, sanitizeData(rawData, Survey.fields()));
      };
      
      getIDValue() {
        return `${this.id}`;
      }

    }
    
    export default Survey;