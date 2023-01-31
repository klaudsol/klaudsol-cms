export const initialState = {
  values: [],
  attributes: [],
  columns: [],
  entity_type_name: null,
  isLoading: false,
  isRefresh: true,
  isSaving: false,
  isDeleting: false,
  show: false,
  entity_type_id: null,
  entity_type_id_parent: null,
  modalContent: null,
};

export const LOADING = 'LOADING';
export const REFRESH = 'REFRESH';
export const SAVING = 'SAVING';
export const DELETING = 'DELETING';
export const CLEANUP = 'CLEANUP';
export const SET_SHOW = 'SET_SHOW';
export const SET_MODAL_CONTENT = 'SET_MODAL_CONTENT';

export const SET_VALUES = 'SET_VALUES';
export const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
export const SET_COLUMNS = 'SET_COLUMNS';
export const SET_ENTITY_TYPE_NAME = 'SET_ENTITY_TYPE_NAME';
export const SET_ENTITY_TYPE_ID = 'SET_ENTITY_TYPE_ID';
export const SET_ENTITY_TYPE_ID_PARENT = 'SET_ENTITY_TYPE_ID_PARENT';


export const reducer = (state, action) => {
  switch(action.type) {
    case LOADING:
        return {
          ...state,
          isLoading: true,
        }

      case SAVING:
          return {
            ...state,
            isSaving: true,
            isLoading: true,
          }

      case DELETING:
            return {
              ...state,
              isDeleting: true,
              isLoading: true,
            }

     case REFRESH:
          return {
            ...state,
            isRefresh: false,
          }

     case CLEANUP:
          return {
            ...state,
            isLoading: false,
            isSaving: false,
            isDeleting: false,
          }

      case SET_SHOW:
            return {
              ...state,
              show: action.payload,
            }
          
    case SET_VALUES:
      return {
        ...state,
        values: action.payload
      }

      case SET_ATTRIBUTES:
        return {
          ...state,
          attributes: action.payload
        }

        case SET_COLUMNS:
          return {
            ...state,
            columns: action.payload
          }

    case SET_ENTITY_TYPE_NAME:
      return {
        ...state,
        entity_type_name: action.payload
      }

      case SET_ENTITY_TYPE_ID_PARENT:
        return {
          ...state,
          entity_type_id_parent: action.payload
        }

      case SET_ENTITY_TYPE_ID:
        return {
          ...state,
          entity_type_id: action.payload
        }

        case SET_MODAL_CONTENT:
          return {
            ...state,
            modalContent: action.payload
          }


  }
};