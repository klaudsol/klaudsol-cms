export const setCORSHeaders = ({response, url}) => {
    if(url) response.setHeader('Access-Control-Allow-Origin', url);
};