/**
 * MIT License

Copyright (c) 2022 KlaudSol Philippines, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/


import UnauthorizedError from '@/components/errors/UnauthorizedError';
import InsufficientPermissionsError from '@/components/errors/InsufficientPermissionsError';
import Capability from '@backend/models/core/Capability';
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

export async function assertUserCan(capabilities, req){
   
  let session_token;
  if(session_token = req.session?.session_token){
    return await Capability.getCapabilitiesByLoggedInUser(capabilities, session_token);
  }
  else{
    // If we can't find the user's ID, we can assume they are a guest.
   return await Capability.getCapabilitiesByGuest(capabilities);
  }    
}