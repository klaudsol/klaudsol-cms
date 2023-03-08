import React from "react";
import { BiSearch } from "react-icons/bi";
import { SET_SEARCH_VALUE, SET_SEARCH_ATTRIBUTE, SET_PAGE, PAGE_SETS_RENDERER } from "@/lib/actions";
import { minPage, minPageEntry } from "lib/Constants"

const SearchBar = ({ dispatch, attributes }) => {
  const onChangeInput = (e) => {
    dispatch({ type: SET_SEARCH_VALUE, payload: e.target?.value });
    dispatch({
      type: SET_PAGE,
      payload: minPageEntry,
    });
    dispatch({
      type: PAGE_SETS_RENDERER,
      payload: minPage,
    });
  };

  const onChangeEntry = (e) => {
    dispatch({ type: SET_SEARCH_ATTRIBUTE, payload: e.target?.value });
    dispatch({
      type: SET_PAGE,
      payload: minPageEntry,
    });
    dispatch({
      type: PAGE_SETS_RENDERER,
      payload: minPage,
    });
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
        {attributes.length &&
          attributes.map((val, i) => (
            <option key={i} value={val}>
              {val}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SearchBar;
