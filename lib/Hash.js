import crypto from 'crypto';

export const createHash = (object) => {
  return crypto.createHash('sha256').update(JSON.stringify(object)).digest('base64');  
};