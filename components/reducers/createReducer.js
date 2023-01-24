export const initialState = {
  attributes: {},
  isLoading: false,
  isRefresh: true,
  isSaving: false,
  show: false,
  entity_type_id: null,
};

export const LOADING = "LOADING";
export const REFRESH = "REFRESH";
export const CLEANUP = "CLEANUP";
export const SAVING = "SAVING";

export const SET_ATTRIBUTES = "SET_ATTRIBUTES";
export const SET_ENTRIES = "SET_ENTRIES";
export const SET_SHOW = "SET_SHOW";
export const SET_ENTITY_TYPE_ID = "SET_ENTITY_TYPE_ID";
export const SET_VALIDATE_ALL = "SET_VALIDATE_ALL";
export const SET_ALL_INITIAL_VALUES = "SET_ALL_INITIAL_VALUES";

export const createEntriesReducer = (state, action) => {
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
      };

    case SET_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
      };

    case SET_ENTRIES:
      return {
        ...state,
        entries: action.payload,
      };

    case SET_SHOW:
      return {
        ...state,
        show: action.payload,
      };

    case SET_ENTITY_TYPE_ID:
      return {
        ...state,
        entity_type_id: action.payload,
      };

    case SET_VALIDATE_ALL:
      return {
        ...state,
        set_validate_all: action.payload,
      };

    case SET_ALL_INITIAL_VALUES:
      return {
        ...state,
        set_all_initial_values: action.payload,
      };
  }
};
