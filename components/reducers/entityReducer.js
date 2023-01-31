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
  modalContent: null,
};

const LOADING = "LOADING";
const REFRESH = "REFRESH";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CLEANUP = "CLEANUP";
const SET_SHOW = "SET_SHOW";
const SET_MODAL_CONTENT = "SET_MODAL_CONTENT";

const SET_VALUES = "SET_VALUES";
const SET_ATTRIBUTES = "SET_ATTRIBUTES";
const SET_COLUMNS = "SET_COLUMNS";
const SET_ENTITY_TYPE_NAME = "SET_ENTITY_TYPE_NAME";
const SET_ENTITY_TYPE_ID = "SET_ENTITY_TYPE_ID";

export const actions = {
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
        isLoading: true,
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
        entity_type_id: action.payload,
      };

    case SET_MODAL_CONTENT:
      return {
        ...state,
        modalContent: action.payload,
      };
  }
};
