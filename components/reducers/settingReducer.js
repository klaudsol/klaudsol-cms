import { SAVING, LOADING, CLEANUP, SET_VALUES, DELETING } from "@/lib/actions" 

export const initialState = {
  isLoading: true,
  isRefresh: true,
  isDeleting: false,
  isSaving: false,
  values: {}
};

export const settingReducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case SAVING:
      return {
        ...state,
        isSaving: true,
      };

    case CLEANUP:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    
    case DELETING:
      return {
        ...state,
        isDeleting: action.payload
      }
    
    case SET_VALUES:
      return {
        ...state,
        values: action.payload
      }
  }
};