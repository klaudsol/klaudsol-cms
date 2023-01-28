export const initialState = {
  values: [],
  columns: [],
  rows: [],
  entity_type_name: null,
  isLoading: false,
  isRefresh: true,
  entry: 10,
  page: 0,
  rows:null,
  setsRenderer:0,
  firstFetch:true,
};


export const LOADING = "LOADING";
export const REFRESH = "REFRESH";
export const CLEANUP = "CLEANUP";

export const SET_VALUES = "SET_VALUES";
export const SET_COLUMNS = "SET_COLUMNS";
export const SET_ENTITY_TYPE_NAME = "SET_ENTITY_TYPE_NAME";
export const SET_ROWS = "SET_ROWS";
export const SET_ENTRIES = "SET_ENTRIES";
export const SET_PAGE = "SET_PAGE";
export const ROWS_SET = "ROWS_SET";
export const PAGE_SETS_RENDERER = "PAGE_SETS_RENDERER";
export const SET_FIRST_FETCH = "SET_FIRST_FETCH";

export const reducer = (state, action) => {
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
        firstFetch: action.payload
      }
  }
};