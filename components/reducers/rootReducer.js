import { 
  SET_CLIENT_SESSION, 
  RESET_CLIENT_SESSION,
  SET_ENTITY_TYPES,
  SET_COLLAPSE,
} from '@/components/reducers/actions';

export const rootReducer = (state, action) => {
    
    const { displayName = null, isLoggedIn = null} = action.payload ?? {};
    
    switch(action.type) {
      
      case SET_CLIENT_SESSION: 
        return {
          ...state,
          displayName: action.payload.displayName,
          isLoggedIn: action.payload.isLoggedIn,
          homepage: action.payload.homepage
        };  
      case RESET_CLIENT_SESSION:
        const { displayName, isLoggedIn, ...resetState } = state; 
        return resetState;
        
      case SET_ENTITY_TYPES:
        return {
          ...state,
          entityTypes: action.payload.entityTypes,
          entityTypesHash: action.payload.entityTypesHash 
        }
      
      case SET_COLLAPSE:
        return {
          ...state,
          collapse: action.payload,
        }
        
      default:
        return state; 
      
    }
  };