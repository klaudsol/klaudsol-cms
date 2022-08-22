import UnauthorizedError from '@/components/errors/UnauthorizedError';
import Session from '@/backend/models/core/Session';

/* Deprecated.
 * Use assert instead.
 *
 **/
export function assertUserIsLoggedIn(req) {
  let session_token;
  if (session_token = req.session?.session_token) {
    return session_token; 
  } else {
    throw new UnauthorizedError();                  
  };    
}

export function assertAppIsEnabled(req, appName) {
  //TODO  
}

export function assertUserHasPermission(req, permissionName) {
  //TODO  
}

/**
 * assert({
 *  loggedIn: true,
 *  appsEnabled: ["trucking"],
 *  userHasPermission: ["manage"]
 * });
 * 
 */
 
export function getSessionToken(req) {
  return req.session?.session_token;   
};

/* 
 * This is just a syntactic sugar of Session.assert
 */

export async function assert(conditions, req) {
  
    const sessionToken = getSessionToken(req);
    await Session.assert(conditions, sessionToken);
  
};