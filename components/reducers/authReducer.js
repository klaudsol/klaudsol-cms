import {
 INIT,
 ERROR,
 CLEANUP,
 SUCCESS
} from "@/lib/actions";

export const initialState = {
  submitted: false,  
  isError: false,
  isLoading: false,
  isLoginSuccessful: false,
  isForceChangePassword: false
};

export const authReducer = (state, action) => {
  switch(action.type) {
    case INIT:     
      return {
        ...state,
        isLoading: true,
        submitted: false
      };
    case SUCCESS:
      return {
        ...state,
        isLoginSuccessful: true,
        isError: false,
        submitted: true
      }
    case ERROR:
      return {
        ...state,
        isLoginSuccessful: false,
        isError: true,
        submitted: true
      }
    case CLEANUP:
      return {
        ...state,
        isLoading: false
      }
    case 'SET_FORCE_CHANGE_PASSWORD':
      return {
        ...state,
        isForceChangePassword: action.payload
      }
    default:
      return state;
  }
};