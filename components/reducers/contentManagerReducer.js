import {
  LOADING,
  REFRESH,
  CLEANUP,
  SET_VALUES,
  SET_COLUMNS,
  SET_ENTITY_TYPE_NAME,
  SET_ROWS,
} from "./actions";

export const initialState = {
  values: [],
  columns: [],
  rows: [],
  entity_type_name: null,
  isLoading: false,
  isRefresh: true,
};

export const contentManagerReducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
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
      };

    case SET_VALUES:
      return {
        ...state,
        values: action.payload,
      };

    case SET_ENTITY_TYPE_NAME:
      return {
        ...state,
        entity_type_name: action.payload,
      };

    case SET_COLUMNS:
      return {
        ...state,
        columns: action.payload,
      };

    case SET_ROWS:
      return {
        ...state,
        rows: action.payload,
      };
  }
};
