import {
  LOADING,
  REFRESH,
  CLEANUP,
  SET_VALUES,
  SET_COLUMNS,
  SET_ENTITY_TYPE_NAME,
  SET_ROWS,
  SET_ENTRIES,
  SET_PAGE,
  ROWS_SET,
  PAGE_SETS_RENDERER,
  SET_FIRST_FETCH,
  TOGGLE_VIEW
} from "@/lib/actions";

export const initialState = {
  values: [],
  columns: [],
  rows: [],
  entity_type_name: null,
  isLoading: true,
  isRefresh: true,
  entry: 10,
  page: 0,
  rows:null,
  setsRenderer:0,
  firstFetch: true,
  view: 'list'
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
    case SET_ENTRIES:
      return {
        ...state,
        entry: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case ROWS_SET:
      return {
        ...state,
        page: action.payload,
      };
    case PAGE_SETS_RENDERER:
      return {
        ...state,
        setsRenderer: action.payload,
      };
    case SET_FIRST_FETCH:
      return {
        ...state,
        firstFetch: action.payload,
      };
    case TOGGLE_VIEW:
      return {
        ...state,
        view: state.view === 'list' ? 'icon' : 'list'
      };
  }
};
