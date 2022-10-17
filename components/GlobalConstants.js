
/*Shared constants between the frontend and the backend*/
const GlobalConstants = {
  
  AURORA_AWS_REGION: 'us-east-1',
  
}

//deprecated
export const backendPath = (path = '') => {
  return '';
}

export const serializeCurrency = (amount) => amount * 1000;
export const displayCurrency = (amount) => new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP'}).format(amount);
export const displaySerializedCurrency = (amount) => displayCurrency(amount / 1000);

export default GlobalConstants;