import AWS from 'aws-sdk';
import {promisify} from 'es6-promisify';
import GlobalConstants  from "@/components/GlobalConstants";
import crypto from 'crypto';

const AURORA_AWS_ACCESS_KEY_ID = process.env.AURORA_AWS_ACCESS_KEY_ID;
const AURORA_AWS_SECRET_ACCESS_KEY = process.env.AURORA_AWS_SECRET_ACCESS_KEY;
const AURORA_RESOURCE_ARN = process.env.AURORA_RESOURCE_ARN;
const AURORA_SECRET_ARN = process.env.AURORA_SECRET_ARN;
const AURORA_DATABASE = process.env.AURORA_DATABASE;

const {
  AURORA_AWS_REGION,
  BACKEND_PORT,
  FRONTEND_PORT
} = GlobalConstants;

class DB {
  
  constructor() {
    
    const rdsConfig =  {
      region: AURORA_AWS_REGION,
      credentials: new AWS.Credentials({
        accessKeyId: AURORA_AWS_ACCESS_KEY_ID,
        secretAccessKey: AURORA_AWS_SECRET_ACCESS_KEY,
      }),
    };

    const RDS = new AWS.RDSDataService(rdsConfig);
    
    const statementConfig = {
      resourceArn: AURORA_RESOURCE_ARN,
      secretArn: AURORA_SECRET_ARN,
      database: AURORA_DATABASE
    } ;   
    
    this.executeStatement = async (sql, parameters=[]) => {  
      const exec = promisify(RDS.executeStatement.bind(RDS));
      return await exec({...statementConfig, sql, parameters});  
    }
    
    this.batchExecuteStatement = async(sql, parameterSets=[]) => {
      const exec = promisify(RDS.batchExecuteStatement.bind(RDS));
      return await exec({...statementConfig, sql, parameterSets});  
    }
  }
  
  
  //OMG the typo has been here the whole time!
  async exectuteStatement(sql, parameters=[]) {
    console.error("Migrate to exectuteStatement to executeStatement ASAP!");
    return this.executeStatement(sql, parameters);  
  }
  
}

export default DB;

export const sha256 = (text) => crypto.createHash('sha256').update(text).digest('base64'); 

export const fieldsForSelect = (table, fieldsHash) => Object.entries(fieldsHash).map(([name]) => `${table}.${name}`).join(',');

const allowedFieldsOnCreate = (fieldsHash) => Object.entries(fieldsHash).filter(([name, {allowOnCreate} ]) => allowOnCreate );
export const fieldsForInsert = (fieldsHash) =>  allowedFieldsOnCreate(fieldsHash).map(([name]) => `${name}`).join(',');
export const fieldParametersForInsert = (fieldsHash) => allowedFieldsOnCreate(fieldsHash).map(([name]) => `:${name}`).join(',');
export const executeStatementParamsForInsert = (fieldsHash, model, transform) =>  allowedFieldsOnCreate(fieldsHash)
  .map(([name, {auroraType}]) => {
    //for flexibiity, we can pass a transformer function to manipulate our data
    const value = transform ? transform(name, model[name]) : model[name];
    return {
      name: name, value: {[`${auroraType}Value`]: value }
    }
  });
  
const allowedFieldsOnUpdate = (fieldsHash) => Object.entries(fieldsHash).filter(([name, {allowOnUpdate} ]) => allowOnUpdate );
export const fieldsForUpdate = (fieldsHash) => allowedFieldsOnUpdate(fieldsHash).map(([name]) => `${name} = :${name}`).join(',');
export const executeStatementParamsForUpdate = (fieldsHash, model, transform) => allowedFieldsOnUpdate(fieldsHash)
  .map(([name, {auroraType}]) => {
    const value = transform ? transform(name, model[name]) : model[name];
    return {
      name: name, value: {[`${auroraType}Value`]: value }
    }
  });


//Allowed datatypes in Aurora Data API
export const AURORA_TYPE = {
  LONG: 'long',
  STRING: 'string',
  BOOLEAN: 'boolean'
};

/*
A single Aurora record looks something like this:
  [
    {
    "longValue": 1
    },
    {
    "stringValue": "System"
    },
    {
    "stringValue": "Administrator"
    },
    {
    "stringValue": "System Administrator"
    },
    {
    "booleanValue": true
    },
    {
    "stringValue": "admin@klaudsol.com"
    },
    {
    "stringValue": "2021-09-22 04:47:09"
    },
    {
    "longValue": 1
    }
  ]
  
  It is rather unwieldy, and has reliance on the order of the fields in the query, so we need a layer that shields the app from this 
  format, and just return a sane key-value Object.
*/
export const fromAurora = (record, fields) =>  Object.fromEntries(Object.entries(fields).map(([key, {auroraType}], index) => [key, record[index][`${auroraType}Value`]]));

export const sanitizeData = (rawData, fields) => {
    const allowedFields = Object.entries(fields).map(([name]) => name);  
    return Object.fromEntries(Object.entries(rawData).filter(([key]) => allowedFields.includes(key)));
};

/*the result of an insert field in Aurora API is:

{ generatedFields: [ { longValue: 26 } ],
  numberOfRecordsUpdated: 1 }

*/

export const fromInsertAurora = (record) => ({id: record.generatedFields[0].longValue});

export const fromDeleteAurora = (record) => record.numberOfRecordsUpdated > 0;
  