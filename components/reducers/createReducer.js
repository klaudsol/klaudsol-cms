import {
  LOADING,
  REFRESH,
  CLEANUP,
  SAVING,
  DRAFTING,
  SET_ATTRIBUTES,
  SET_ENTRIES,
  SET_SHOW,
  SET_ENTITY_TYPE_ID,
  SET_VALIDATE_ALL,
  SET_ALL_INITIAL_VALUES,
} from "@/lib/actions";

export const initialState = {
  attributes: {},
  isLoading: false,
  isRefresh: true,
  isSaving: false,
  isDrafting: false,
  show: false,
  entity_type_id: null,
};

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
      };

    case DRAFTING:
      return {
        ...state,
        isDrafting: true,
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
        isDrafting: false,
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
