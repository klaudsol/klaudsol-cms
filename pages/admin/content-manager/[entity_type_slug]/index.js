import CacheContext from "@/components/contexts/CacheContext";
import React, { useEffect, useReducer, useRef, useContext, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { useRouter } from "next/router";
import RootContext from '@/components/contexts/RootContext';

/** kladusol CMS components */
import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppIconButton from "@/components/klaudsolcms/buttons/AppIconButton";
import AppContentManagerTable from "components/klaudsolcms/tables/AppContentManagerTable";
import AppContentManagerTableIconView from "@/components/klaudsolcms/views/AppContentManagerIconView";
import SkeletonTable from "components/klaudsolcms/skeleton/SkeletonTable";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";

/** react-icons */
import { 
  FaList,
  FaTh,
  FaDownload,
  FaUpload
} from "react-icons/fa";

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
  TOGGLE_VIEW,
  SET_DATA,
  SET_METADATA,
  SET_IMPORT_CSV_MODAL
} from "@/lib/actions";
import AppContentPagination from "components/klaudsolcms/pagination/AppContentPagination";
import { defaultPageRender, maximumNumberOfPage, EntryValues, writeContents, downloadCSV, importCSV } from "lib/Constants"

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks"
import { handleDownloadCsv } from "@/lib/downloadCSV";
import { Spinner } from "react-bootstrap";
import { defaultEntityTypeVariant, entityTypeVariantsEnum } from "@/constants";
import SingleType from "@/components/entity_types/SingleType";
import LoadingModal from "@/components/modals/LoadingModal";
import ErrorModal from "@/components/modals/ErrorModal";

export default function ContentManager({ cache }) {
  const router = useRouter();
  const errorHandler = useClientErrorHandler();
  const capabilities = cache?.capabilities;
  const { entity_type_slug } = router.query;
  const controllerRef = useRef();
  const { state: {currentContentType} } = useContext(RootContext);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const [state, dispatch] = useReducer(contentManagerReducer, initialState);

  const downloadCSVapi = `/api/downloadCsv?entity_type_slug=${entity_type_slug}`;

  const [variant, setVariant] = useState(defaultEntityTypeVariant);
  const [attributes, setAttributes] = useState({});
  const [entityTypeId, setEntityTypeId] = useState(0);
  const [errorModal, setErrorModal] = useState(false);

  /*** Entity Types List ***/
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: LOADING })
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        const controller = new AbortController();
        controllerRef.current = controller;
       // Assign a new AbortController for the latest fetch to our useRef variable

        const valuesRaw = await slsFetch(
          `/api/${entity_type_slug}?page=${state.page}&entry=${state.entry}&drafts=true`,
          { 
            signal: controllerRef.current?.signal,
          }
        );
          
        const values = await valuesRaw.json();
        const attributes = values.metadata.attributes;

        setAttributes(attributes);
        setVariant(values.metadata.variant);

        dispatch({type: SET_DATA, payload: values.data});
        dispatch({type: SET_METADATA, payload: values.metadata});
        const pageNumber = Math.ceil(values.metadata.total_rows / state.entry);
        dispatch({ type: SET_ROWS, payload: pageNumber });
        dispatch({ type: SET_ENTITY_TYPE_NAME, payload: values.metadata.type });
        setEntityTypeId(values.metadata.entity_type_id);
        let columns = [];
        let entries = [];
        let singleTypeEntries = {};

        entries = Object.values(values.data ?? []);
        singleTypeEntries = values.data ?? {};
        columns = Object.keys(values.metadata.attributes).map((col) => {
          return {
            accessor: col,
            displayName: col.toUpperCase(),
          };
        });

        columns.unshift({ accessor: "status", displayName: "STATUS" });
        columns.unshift({ accessor: "slug", displayName: "SLUG" });
        columns.unshift({ accessor: "id", displayName: "ID" });
        dispatch({ type: SET_COLUMNS, payload: columns });
        dispatch({ type: SET_VALUES, payload: values.metadata.variant === entityTypeVariantsEnum.singleton ? singleTypeEntries : entries });
        controllerRef.current = null;
      } catch (ex) {
        errorHandler(ex);
      } finally {
        !controllerRef.current && dispatch({ type: CLEANUP });
        !controllerRef.current && dispatch({ type: SET_FIRST_FETCH, payload: false });       
      }
    })();
  }, [entity_type_slug, state.page, state.entry, state.setsRenderer]);

  useEffect(() => {
    dispatch({type: SET_PAGE,payload: defaultPageRender});
    dispatch({type: PAGE_SETS_RENDERER,payload: defaultPageRender});
  }, [entity_type_slug]);

  const handleView = (view) => {
    dispatch({ type: TOGGLE_VIEW, payload: view })
  }

  const generateUniqueSlug = () => {
    // Get current timestamp
    const timestamp = Date.now();

    // Introduce a small delay to ensure unique timestamp
    while (Date.now() === timestamp) {}

    const randomString = Math.random().toString(36).substr(2, 9);
    const slug = `${timestamp}-${randomString}`;
  
    return slug;
  }

  // At the moment, the function can only retrieve CSV files
  // TODO: also consider .xlsx and .xls files
  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      // Check if CSV file has the same fields with the content type
      const validCSV = validateCSV(contents);
      
      // If CSV is the same
      // Process the CSV/Excel contents here
      if (validCSV) {
        let res = convertCSVToArray(contents);
        res = res.map(x => {
          return {
            ...x, 
            slug: generateUniqueSlug(),
            entity_type_id: state.metadata.entity_type_id,
            status: "draft"
          }
        })
        onCSVUpload(res);
      } else {
        setErrorModal(true);
      }

      // Reset the value of the file input element
      event.target.value = null;
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  // Function that checks if CSV file has the same fields with the content type
  const validateCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');

    const updatedArray = headers.map((element) => element.trim());
    const filteredArray = state.columns.filter(obj => obj.accessor !== 'id' && obj.accessor !== 'status' && obj.accessor !== 'slug');
    const filteredAccessorArray = filteredArray.map(obj => obj.accessor);

    const isSameArray = updatedArray.every(element => filteredAccessorArray.includes(element));

    console.log(filteredAccessorArray);
    console.log(filteredArray);
    console.log(isSameArray);

    return isSameArray;
  }

  // Converts the CSV file to an array
  const convertCSVToArray = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');

    const result = lines.slice(1).map((line) => {
      const row = line.split(',');
  
      const obj = headers.reduce((acc, header, index) => {
        const value = row[index].trim(); // Remove leading/trailing whitespace
        const modifiedHeader = index === headers.length - 1 ? header.trim().replace(' ', '') : header;
        acc[modifiedHeader] = value;
        return acc;
      }, {});

      return obj;
    });
  
    return result;
  };

  // handles upload function
  const onCSVUpload = async (values) => {
    try {
      dispatch({ type: SET_IMPORT_CSV_MODAL, payload: { show: true, loading: true } });
      const responseRaw = await slsFetch(`/api/uploadCsv`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
      });
      const response = await responseRaw.json();
    } catch (ex) {
      errorHandler(ex);
    } finally {
      dispatch({ type: SET_IMPORT_CSV_MODAL, payload: { show: true, loading: false, message: '' } });
    }
  };

  // Function to be called when loading modal is closed
  const handleCloseLoadingModal = () => {
    dispatch({ type: SET_IMPORT_CSV_MODAL, payload: { loading: false, show: false }});
    router.reload();
  }

  return (
    <CacheContext.Provider value={cache}>
      <div className="d-flex flex-row mt-0 pt-0 mx-0 px-0">
        <ContentManagerLayout currentTypeSlug={entity_type_slug}>
          <div className="py-4">
            <AppBackButton link="/admin" />
            <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
              <div>
                <div className="general-header"> {/*entity_type_name*/} </div>
                <a
                  href={`/api/${entity_type_slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  api/{entity_type_slug}
                </a>
                {variant === entityTypeVariantsEnum.collection && <p> {state.values.length} entries found </p>}
              </div>
              <div className="general-row-center" style={{ gap: '5px'}}>
              {capabilities.includes(writeContents) && variant === entityTypeVariantsEnum.collection &&
              <AppCreatebutton
                link={`/admin/content-manager/${entity_type_slug}/create`}
                title="Create new entry"
              />}
              {state.view === 'list' && 
               capabilities.includes(downloadCSV) && 
               Object.keys(state.values).length > 0 &&
               <button 
                 disabled={state.isLoading || downloadingCSV} 
                 className="general-button-download" 
                 onClick={() => handleDownloadCsv(downloadCSVapi, setDownloadingCSV)}> 
                 {downloadingCSV ? 
                   <Spinner size='sm' /> : 
                   <FaDownload />} 
                  Download as CSV 
               </button>} 
               {capabilities.includes(importCSV) && 
               variant === entityTypeVariantsEnum.collection &&
               <>
                <input 
                 id="import-csv"
                 type="file"
                 accept=".csv"
                 onChange={handleFileUpload} 
                 />
                 <label htmlFor="import-csv" className="general-button-download" disabled={state.isLoading}><FaUpload /> Import CSV</label>
               </>}
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center px-0 mx-0 pb-3">
            
              {/*<div className="d-flex flex-row px-0">
                TODO:
                  <AppIconButton icon={<FaSearch/>} /> 
                  <AppButtonSm title='Filters' icon={<IoFilter />} isDisabled={false}/>
              </div>*/}
              {/* This does not show
                <AppDropdown
                  title={state.columns.length + " items selected"}
                  items={state.columns}
                  id="dropdown_general"
                  isCheckbox={true}
              />*/}
              {variant === entityTypeVariantsEnum.collection && 
              <div className="general-row-end" style={{ gap: '5px '}}>
                <AppIconButton icon={<FaList/>} selected={state.view ==='list'} onClick={() => handleView('list')}/>
                <AppIconButton icon={<FaTh />} selected={state.view === 'icon'} onClick={() => handleView('icon')}/>
              </div>}
              {/* <AppIconButton icon={<BsGearFill/>} />  */}
            </div>

            {variant === entityTypeVariantsEnum.singleton && 
              <SingleType 
                loading={state.isLoading}
                entries={state.values}
                entity_type_slug={entity_type_slug}
                attributes={attributes}
                capabilities={capabilities}
                entity_type_id={entityTypeId}
              />}

            {(state.isLoading && state.firstFetch) && <SkeletonTable />}
      
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && 
              state.view === 'list' &&
              variant === entityTypeVariantsEnum.collection && (
                <AppContentManagerTable
                  columns={state.columns}
                  entries={state.values}
                  entity_type_slug={entity_type_slug}
                  data={state.data}
                  metadata={state.metadata}
                />
            )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && 
              state.view === 'icon' && 
              variant === entityTypeVariantsEnum.collection && (
              <AppContentManagerTableIconView
                columns={state.columns}
                entries={state.values}
                entity_type_slug={entity_type_slug}
              />
            )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && 
            variant === entityTypeVariantsEnum.collection && (
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
          <div className="py-3" />

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

        <LoadingModal 
          show={state.importCSVModal.show} 
          loading={state.importCSVModal.loading} 
          message="You have successfully imported the CSV file" 
          hide={() => handleCloseLoadingModal()}
        />

        <ErrorModal 
          show={errorModal}
          hide={() => setErrorModal(false)}
          message="The CSV file does not match. Please try again."
        />
                  
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
