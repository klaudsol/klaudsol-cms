import React from "react";
import { BiSearch } from "react-icons/bi";
import {
  LOADING,
  SET_ENTITY_TYPE_NAME,
  SET_COLUMNS,
  SET_VALUES,
  CLEANUP,
  SET_ROWS,
  SET_FIRST_FETCH,
  SET_PAGE,
  PAGE_SETS_RENDERER,
  SET_SEARCH_VALUE,
  SET_SEARCH_ATTRIBUTE,
  ATTRIBUTES_SELECTION,
} from "@/lib/actions";

const SearchBar = ({ dispatch, attributes }) => {

  const onChangeInput = (e) => {
    dispatch({ type: SET_SEARCH_VALUE, payload: e.target?.value });
  }

  const onChangeEntry = (e) => {
    dispatch({ type: SET_SEARCH_ATTRIBUTE, payload: e.target?.value });
  };

  return (
    <div className="tool-bar">
      <div className="search-bar">
        <div className="search-icon-container">
          <BiSearch className="search-icon" />
        </div>
        <input
          type="text"
          placeholder="search content"
          className="search-input"
          onChange={onChangeInput}
        />
      </div>
      <select
        defaultValue="slug"
        name="selection-bar"
        className="selection-bar"
        onChange={onChangeEntry}
      >
        {attributes.length && attributes.map((val, i) => (
          <option key={i} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
