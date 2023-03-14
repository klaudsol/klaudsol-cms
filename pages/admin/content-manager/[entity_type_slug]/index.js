import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import ContentManagerSubMenu from "@/components/elements/inner/ContentManagerSubMenu";

import React, { useEffect, useReducer, useRef, useContext } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { useRouter } from "next/router";
import RootContext from '@/components/contexts/RootContext';

/** kladusol CMS components */
import AppDropdown from "@/components/klaudsolcms/AppDropdown";
import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppIconButton from "@/components/klaudsolcms/buttons/AppIconButton";
import AppButtonSm from "@/components/klaudsolcms/buttons/AppButtonSm";

/** react-icons */
import { FaChevronLeft, FaSearch, FaChevronRight } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BsGearFill } from "react-icons/bs";
import AppContentManagerTable from "components/klaudsolcms/tables/AppContentManagerTable";
import SkeletonTable from "components/klaudsolcms/skeleton/SkeletonTable";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";
import {
  contentManagerReducer,
  initialState,
} from "@/components/reducers/contentManagerReducer";
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
  SET_ATTRIBUTES,
  SET_SEARCH_ATTRIBUTE
} from "@/lib/actions";
import AppContentPagination from "components/klaudsolcms/pagination/AppContentPagination";
import SearchBar from "components/klaudsolcms/pagination/SearchBar";
import { defaultPageRender, maximumNumberOfPage, EntryValues, writeContents} from "lib/Constants"
import { getSessionCache } from "@klaudsol/commons/lib/Session";

export default function ContentManager({ cache }) {
  const router = useRouter();
  const capabilities = cache?.capabilities;
  const { entity_type_slug } = router.query;
  const controllerRef = useRef();
  const { state: {currentContentType:{ entity_type_name, entity_type_slug: headerSlug } } } = useContext(RootContext);

 const [state, dispatch] = useReducer(contentManagerReducer, initialState);

  /*** Entity Types List ***/
  useEffect(() => {
    (async () => {
      try {
         dispatch({type:LOADING})
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        const controller = new AbortController();
        controllerRef.current = controller;
       // Assign a new AbortController for the latest fetch to our useRef variable

        const valuesRaw = await slsFetch(
          `/api/${entity_type_slug}?page=${state.page}&entry=${state.entry}&filters?[${state.searchAttribute}][$contains]=${state.searchValue}`,
          { signal: controllerRef.current?.signal }
        );
          
        const values = await valuesRaw.json();
        const pageNumber = Math.ceil(values.metadata.total_rows / state.entry);
        dispatch({ type: SET_ROWS, payload: pageNumber });
        dispatch({ type: SET_ENTITY_TYPE_NAME, payload: values.metadata.type });
        let columns = [];
        let entries = [];
        let attributes = [];
 
        attributes = Object.keys(values.metadata.attributes)
        entries = Object.values(values.data);
        columns = Object.keys(values.metadata.attributes).map((col) => {
          return {
            accessor: col,
            displayName: col.toUpperCase(),
          };
        });
 
        columns.unshift({ accessor: "slug", displayName: "SLUG" });
        columns.unshift({ accessor: "id", displayName: "ID" });
        
        dispatch({ type: SET_COLUMNS, payload: columns });
        dispatch({ type: SET_VALUES, payload: entries });
        dispatch({ type: SET_SEARCH_ATTRIBUTE, payload: attributes[0] })
        dispatch({ type: SET_ATTRIBUTES, payload: attributes })
        controllerRef.current = null;
      } catch (ex) {
        console.log(ex)
      } finally {
        !controllerRef.current && dispatch({ type: CLEANUP });
        !controllerRef.current && dispatch({ type: SET_FIRST_FETCH, payload: false });       
      }
    })();
  }, [entity_type_slug, state.page, state.entry, state.setsRenderer, state.searchValue, state.searchAttribute]);


  useEffect(() => {
    dispatch({type: SET_PAGE,payload: defaultPageRender});
    dispatch({type: PAGE_SETS_RENDERER,payload: defaultPageRender});
  }, [entity_type_slug]);

  return (
    <CacheContext.Provider value={cache}>
      <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
        <ContentManagerLayout currentTypeSlug={entity_type_slug}>
          <div className="py-4">
            <AppBackButton link="/admin" />
            <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
              <div>
                <div className="general-header"> {entity_type_name} </div>
                <a
                  href={`/api/${entity_type_slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  api/{headerSlug}
                </a>
                <p> {state.values.length} entries found </p>
              </div>
             {capabilities.includes(writeContents) && <AppCreatebutton
                link={`/admin/content-manager/${entity_type_slug}/create`}
                title="Create new entry"
              />}
            </div>

            <div className="d-flex justify-content-between align-items-center px-0 mx-0 pb-3">
              <div className="d-flex flex-row px-0">
                {/*TODO:
                <AppIconButton icon={<FaSearch/>} /> 
              <AppButtonSm title='Filters' icon={<IoFilter />} isDisabled={false}/>
              */}
              </div>

              <div className="d-flex flex-row px-0">
                <AppDropdown
                  title={state.columns.length + " items selected"}
                  items={state.columns}
                  id="dropdown_general"
                  isCheckbox={true}
                />
                {/* <AppIconButton icon={<BsGearFill/>} />  */}
              </div>
            </div>

            {(state.isLoading && state.firstFetch) && <SkeletonTable />}
            
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && (
              <SearchBar dispatch={dispatch} attributes={state.attributes}/>
            )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && (
              <AppContentManagerTable
                columns={state.columns}
                entries={state.values}
                entity_type_slug={entity_type_slug}
              />
            )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && (
              <AppContentPagination
                dispatch={dispatch}
                defaultEntry={state.entry}
                defaultPage={state.page}
                entity_type_slug={entity_type_slug}
                rows={state.rows}
                setsRenderer={state.setsRenderer}
                isLoading={state.isLoading} 
                maximumNumberOfPage={maximumNumberOfPage}
                EntryValues={EntryValues} // Array (optional) if you want to add "select" options for entries per page 
                                          // default value is 10
              />
            )}
          </div>

          {/*<div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-row">
            <AppDropdown title='10' items={entryNumber} id='dropdown_entries' isCheckbox={false}/>
            <p className="mt-2"> Entries per page </p> 
          </div>
        
          <div className="d-flex flex-row">
            <button className="btn_arrows"> <FaChevronLeft className="mb-2 mr-1" style={{fontSize: "10px"}}/> </button>
            <p className="page_number"> 1 </p> 
            <button className="btn_arrows"> <FaChevronRight className="mb-2 ml-1" style={{fontSize: "10px"}}/> </button>
          </div>
        </div>*/}
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
