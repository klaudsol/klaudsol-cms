import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { log } from '@/lib/Logger';
import { slsFetch } from "@/components/Util";
import Session from '@backend/models/core/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { assertUserIsLoggedIn } from '@/lib/Permissions';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'klaudsol-cms',
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

export async function serverSideLogout(req) {
  const session_token = await assertUserIsLoggedIn(req);
  await Session.logout(session_token); 
  req.session.destroy();
}

export function getSessionCache() {
  return withIronSessionSsr(async ({ req, res }) => {
    
    try{
      if(!req.session?.cache) {
        return {
         redirect: {
          permanent: false,
          destination: '/',
          }
        }
      } 
      if(req.session?.cache?.forcePasswordChange){ 
        await serverSideLogout(req)
        // handle the logout logic on the server-side
        return {
          redirect: {
            permanent: false,
            destination: '/'
          }
        }
      }
    }
    catch(error){
      await defaultErrorHandler(error, req, res);
    }
 
    // Pass data to the page via props
    return { props: { cache: req.session?.cache} }
    },
    sessionOptions
  );  
}
