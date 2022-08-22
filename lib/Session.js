import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { log } from '@/lib/Logger';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'sme.klaudsol.app',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
}

export function withSession (handler) {
  try {
    
    return withIronSessionApiRoute(handler, sessionOptions) 
    
  } catch (ex) {
    log(ex);
  }
};

export function getSessionCache() {
  return withIronSessionSsr(async ({ req, res }) => {
    
    if(!req.session?.cache) {
      return {
       redirect: {
        permanent: false,
        destination: '/',
        }
      }
    } 
  
    // Pass data to the page via props
    return { props: { cache: req.session?.cache} }
    },
    sessionOptions
  );  
}
