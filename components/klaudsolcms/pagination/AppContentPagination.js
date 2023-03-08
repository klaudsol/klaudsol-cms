import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import AppButtonSpinner from '@/components/klaudsolcms/AppButtonSpinner';
import { minPage, minPageEntry } from "lib/Constants"
import {
  SET_ENTRIES,
  SET_PAGE,
  PAGE_SETS_RENDERER,
} from "@/lib/actions";

const AppContentPagination = ({
  dispatch, 
  defaultEntry, // represents the LIMIT in api 
  defaultPage,  // represents the OFFSET in api
  rows,         // total number of entities the slug has.
  setsRenderer, // offset in the maximumNumberOfPage. default value is zero.  
  isLoading,
  EntryValues, // options entry value in dropdown
  maximumNumberOfPage // maximum number of page displayed
}) => {

  const limit = rows - setsRenderer * maximumNumberOfPage;
  const lengthParams = limit > maximumNumberOfPage ? maximumNumberOfPage : limit;

  const setRendererIsZero = setsRenderer === 0;
  const rightButtonStatus = setsRenderer === Math.floor(rows / maximumNumberOfPage);

  // left double arrow
  const prevPageEntry = (setsRenderer - 1) * maximumNumberOfPage;
  const prevPage = setsRenderer - 1;
 // left arrow


  const maxPage = Math.floor(rows / maximumNumberOfPage);
  const maxPageEntry = (Math.floor(rows / maximumNumberOfPage) * maximumNumberOfPage);
 // right double arrow

  const nextPageEntry = (setsRenderer + 1) * maximumNumberOfPage; 
  const nextPage = setsRenderer + 1;
// right arrow


  const onChangeEntry = (evt) => {
    dispatch({ type: SET_ENTRIES, payload: evt.target.value });
  };

  const shiftPage = (page) => {
    dispatch({ type: SET_PAGE, payload: page });
  };

  return (
    <div className="pagination-general">
      <div>
        {EntryValues && <select
          defaultValue={defaultEntry}
          name="pagination"
          className="pagination-dropdown"
          onChange={onChangeEntry}
        >
          {EntryValues.map((val,i)=>(
            <option key={i} value={val}>{val}</option>
          ))}
        </select>}
        <label htmlFor="pagination">Entries per page</label>
      </div>
      <div className="pagination-buttons-container">
        {isLoading && <AppButtonSpinner/>}
        <button
          className="page-shift-button-left-double"
          disabled={setRendererIsZero}
          onClick={() => {
            dispatch({
              type: SET_PAGE,
              payload: minPageEntry,
            });
            dispatch({
              type: PAGE_SETS_RENDERER,
              payload: minPage,
            });
          }}
        >
          <AiOutlineDoubleLeft
            className="page-shift-icons-double"
            style={{ height: "1.2em" }}
          />
        </button>
        <button
          className="page-shift-button-left"
          disabled={setRendererIsZero}
          name="page-shift-button-left"
          onClick={() => {
            dispatch({
              type: SET_PAGE,
              payload: prevPageEntry,
            });
            dispatch({
              type: PAGE_SETS_RENDERER,
              payload: prevPage,
            });
          }}
        >
          <MdKeyboardArrowLeft
            style={{ height: "1.5em" }}
            className="page-shift-icons"
          />
        </button>
        {rows &&
          Array.from(
            { length: lengthParams },
            (_, i) => (
              <button
                className={
                  Number(defaultPage) !==
                  (setRendererIsZero ? i : setsRenderer * maximumNumberOfPage + i)
                    ? "page-number-button"
                    : "page-number-button active"
                }
                key={i}
                disabled={
                  Number(defaultPage) ===
                  (setRendererIsZero ? i : setsRenderer * maximumNumberOfPage + i)
                }
                onClick={() =>
                  shiftPage(
                    setRendererIsZero ? i : setsRenderer * maximumNumberOfPage + i
                  )
                }
              >
                <span className="page-number">
                  {i + maximumNumberOfPage * setsRenderer + 1}
                </span>
              </button>
            )
          )}
        <button
          className="page-shift-button-right"
          disabled={rightButtonStatus}
          name="page-shift-button-right"
          onClick={() => {
            dispatch({
              type: SET_PAGE,
              payload: nextPageEntry,
            });
            dispatch({
              type: PAGE_SETS_RENDERER,
              payload: nextPage,
            });
          }}
        >
          <MdKeyboardArrowRight
            style={{ height: "1.5em" }}
            className="page-shift-icons"
          />
        </button>
        <button
          className="page-shift-button-right-double"
          disabled={rightButtonStatus}
          onClick={() => {
            dispatch({
              type: SET_PAGE,
              payload: maxPageEntry,
            });
            dispatch({
              type: PAGE_SETS_RENDERER,
              payload: maxPage,
            });
          }}
        >
          <AiOutlineDoubleRight
            className="page-shift-icons-double"
            style={{ height: "1.2em" }}
          />
        </button>
      </div>
    </div>
  );
};

export default AppContentPagination;