import {
  LOADING,
  REFRESH,
  SAVING,
  DELETING,
  CLEANUP,
  SET_SHOW,
  SET_MODAL_CONTENT,
  SET_VALUES,
  SET_ATTRIBUTES,
  SET_COLUMNS,
  SET_ENTITY_TYPE_NAME,
  SET_ENTITY_TYPE_ID,
  SET_VALIDATE_ALL,
  SET_S3_TO_DELETE
} from "@/lib/actions";

export const initialState = {
  imageToDelete: [],
  values: [],
  attributes: [],
  columns: [],
  entity_type_name: null,
  isLoading: false,
  isRefresh: true,
  isSaving: false,
  isDeleting: false,
  show: false,
  entityTypeId: null,
  modalContent: null,
  allValidates: null,
};

export const entityReducer = (state, action) => {
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

    case DELETING:
      return {
        ...state,
        isDeleting: true,
        isLoading: true,
      };

    case REFRESH:
      return {
        ...state,
        isRefresh: false,
      };

    case CLEANUP:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
        isDeleting: false,
      };

    case SET_SHOW:
      return {
        ...state,
        show: action.payload,
      };

    case SET_VALUES:
      return {
        ...state,
        values: action.payload,
      };

    case SET_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
      };

    case SET_COLUMNS:
      return {
        ...state,
        columns: action.payload,
      };

    case SET_ENTITY_TYPE_NAME:
      return {
        ...state,
        entity_type_name: action.payload,
      };

    case SET_ENTITY_TYPE_ID:
      return {
        ...state,
        entityTypeId: action.payload,
      };

    case SET_MODAL_CONTENT:
      return {
        ...state,
        modalContent: action.payload,
      };
    case SET_VALIDATE_ALL:
      return {
        ...state,
        allValidates: action.payload
      }
    case SET_S3_TO_DELETE:
      return {
        ...state,
        imageToDelete: action.payload
      }
    default:
      return {
        ...state
      }
  }
};
