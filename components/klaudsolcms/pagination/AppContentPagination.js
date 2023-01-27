import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";

import {
  SET_ENTRIES,
  SET_PAGE,
  PAGE_SETS_RENDERER,
} from "@/components/reducers/entitiesReducer";

const AppContentPagination = ({
  dispatch,
  defaultEntry,
  defaultPage,
  rows,
  setsRenderer,
}) => {
  const offsetRenderer = 10;
  const limit = rows - setsRenderer * offsetRenderer;

  const setRendererIsZero = setsRenderer === 0;
  const rightButtonStatus = setsRenderer === Math.floor(rows / offsetRenderer);

  const minPage = 0;
  const minPageEntry = 0;
  // left double arrow
  const prevPageEntry = (setsRenderer - 1) * offsetRenderer;
  const prevPage = setsRenderer - 1;
 // left arrow


  const maxPage = Math.floor(rows / offsetRenderer);
  const maxPageEntry = (Math.floor(rows / offsetRenderer) * offsetRenderer);
 // right double arrow

 console.log(defaultPage)
 console.log(setsRenderer)


  const nextPageEntry = (setsRenderer + 1) * offsetRenderer; 
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
        <select
          defaultValue={defaultEntry}
          name="pagination"
          className="pagination-dropdown"
          onChange={onChangeEntry}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <label htmlFor="pagination">Entries per page</label>
      </div>
      <div className="pagination-buttons-container">
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
            { length: limit > offsetRenderer ? offsetRenderer : limit },
            (_, i) => (
              <button
                className={
                  Number(defaultPage) !==
                  (setRendererIsZero ? i : setsRenderer * offsetRenderer + i)
                    ? "page-number-button"
                    : "page-number-button active"
                }
                key={i}
                disabled={
                  Number(defaultPage) ===
                  (setRendererIsZero ? i : setsRenderer * offsetRenderer + i)
                }
                onClick={() =>
                  shiftPage(
                    setRendererIsZero ? i : setsRenderer * offsetRenderer + i
                  )
                }
              >
                <span className="page-number">
                  {i + offsetRenderer * setsRenderer + 1}
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
