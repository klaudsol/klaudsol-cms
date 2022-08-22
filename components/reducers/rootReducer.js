export const rootReducer = (state, action) => {
    
    const { displayName = null, isLoggedIn = null} = action.payload ?? {};
    
    switch(action.type) {
      
      case 'SET_CLIENT_SESSION': 
        return {
          ...state,
          displayName: action.payload.displayName,
          isLoggedIn: action.payload.isLoggedIn,
          homepage: action.payload.homepage
        };  
      case 'RESET_CLIENT_SESSION':
        const { displayName, isLoggedIn, ...resetState } = state; 
        return resetState;
        
      default:
        return state; 
      
    }
  };