
/*Shared constants between the frontend and the backend*/
const GlobalConstants = {
  
  backendRelativePath: '/.netlify/functions/index',
  AURORA_AWS_REGION: 'us-east-1',
  BACKEND_PORT: 8080,
  FRONTEND_PORT: 8081
  
}

export const backendPath = (path = '') => {
  return `${GlobalConstants.backendRelativePath}${path}`;
}

export const serializeCurrency = (amount) => amount * 1000;
export const displayCurrency = (amount) => new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP'}).format(amount);
export const displaySerializedCurrency = (amount) => displayCurrency(amount / 1000);

export default GlobalConstants;