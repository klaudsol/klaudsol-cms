import CacheContext from "@/components/contexts/CacheContext";

import React, { useEffect, useReducer, useRef, useContext, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { useRouter } from "next/router";
import { extractFiles } from "@/lib/s3FormController";
import RootContext from '@/components/contexts/RootContext';

/** kladusol CMS components */
import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import AppBackButton from "@/components/klaudsolcms/buttons/AppBackButton";
import AppIconButton from "@/components/klaudsolcms/buttons/AppIconButton";
import AppButtonLg from "@/components/klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import AppInfoModal from "@/components/klaudsolcms/modals/AppInfoModal";
import AppContentManagerTable from "components/klaudsolcms/tables/AppContentManagerTable";
import AppContentManagerTableIconView from "@/components/klaudsolcms/views/AppContentManagerIconView";
import SkeletonTable from "components/klaudsolcms/skeleton/SkeletonTable";
import ContentManagerLayout from "components/layouts/ContentManagerLayout";

/** react-icons */
import { 
  FaCheck,
  FaList,
  FaTh,
  FaDownload
} from "react-icons/fa";

import {
  contentManagerReducer,
  initialState,
} from "@/components/reducers/contentManagerReducer";
import {
  LOADING,
  SAVING,
  SET_ENTITY_TYPE_NAME,
  SET_COLUMNS,
  SET_VALUES,
  CLEANUP,
  SET_ROWS,
  SET_FIRST_FETCH,
  SET_PAGE,
  PAGE_SETS_RENDERER,
  TOGGLE_VIEW,
  SET_SHOW,
  SET_MODAL_CONTENT
} from "@/lib/actions";
import AppContentPagination from "components/klaudsolcms/pagination/AppContentPagination";
import { defaultPageRender, maximumNumberOfPage, EntryValues, writeContents, downloadCSV } from "lib/Constants"

import { getSessionCache } from "@klaudsol/commons/lib/Session";
import { useClientErrorHandler } from "@/components/hooks"
import { handleDownloadCsv } from "@/lib/downloadCSV";
import { Spinner } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { sortByOrderAsc } from "@/components/Util";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { uploadFilesToUrl } from "@/backend/data_access/S3";
import GeneralHoverTooltip from "@/components/elements/tooltips/GeneralHoverTooltip";
import { RiQuestionLine } from "react-icons/ri";
import { slugTooltipText } from "@/constants";
import classname from "classnames";
import TypesValidator from "@/components/renderers/validation/RegexValidator";

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

  const [singleType, setSingleType] = useState(false);
  const [attributes, setAttributes] = useState({});
  const formRef = useRef();

  const [entityTypeId, setEntityTypeId] = useState(0);

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
          `/api/${entity_type_slug}?page=${state.page}&entry=${state.entry}`,
          { 
            signal: controllerRef.current?.signal,
          }
        );
          
        const values = await valuesRaw.json();
        const attributes = values.metadata.attributes;

        setAttributes(attributes);
        setSingleType(values.metadata.is_single_type);

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

        columns.unshift({ accessor: "slug", displayName: "SLUG" });
        columns.unshift({ accessor: "id", displayName: "ID" });
        dispatch({ type: SET_COLUMNS, payload: columns });
        dispatch({ type: SET_VALUES, payload: values.metadata.is_single_type ? singleTypeEntries : entries });
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

  const getFormikInitialVals = () => {
    const { slug, id, ...initialValues } = state.values;
    return state.values;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    formRef.current.handleSubmit();
    formRef.current.setTouched({ ...state.set_validate_all, slug: true });
  };


  const formatSlug = (slug) => {
    return slug.toLowerCase().replace(/\s+/g, "-");
  };

  const formikParams = {
    innerRef: formRef,
    initialValues: getFormikInitialVals(),
    onSubmit: (values) => {
      (async () => {
        try {
          dispatch({ type: SAVING });
          const { slug } = values;
          const { data, fileNames, files } = await extractFiles(values);
          // Checks if the entry is to be updated or not
          // If there are no entries yet, it will call a different API (similar to create entry)
          // Method is POST
          const isUpdate = Object.keys(state.values).length > 0;
          let url = `/api/${entity_type_slug}`;
          let method = 'POST';
          let formattedSlug = formatSlug(slug);
          let entry = {
            ...data,
            fileNames,
            slug: formattedSlug,
            entity_type_id: entityTypeId,
          }

          // If there is already an existing entry, it will call a different API to update 
          // Method is PUT
          if (isUpdate) {
            url = `/api/${entity_type_slug}/${values.id}`;
            method = 'PUT';
            entry = {
              ...data,
              fileNames,
              entity_type_slug,
              entity_id: values.id,
            }
          }
        
  
          const response = await slsFetch(url, {
            method: method,
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(entry),
          });

          const { message, presignedUrls } = await response.json();

          if (files.length > 0) await uploadFilesToUrl(files, presignedUrls);

          dispatch({
            type: SET_MODAL_CONTENT,
            payload: message,
          });
          dispatch({ type: SET_SHOW, payload: true });
        } catch (ex) {
          errorHandler(ex);
        } finally {
          dispatch({ type: CLEANUP });
        }
      })();
    },
  };

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
                <p> {state.values.length} entries found </p>
              </div>
              <div className="general-row-center" style={{ gap: '5px'}}>
              {capabilities.includes(writeContents) && !singleType &&
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
              {!singleType && 
              <div className="general-row-end" style={{ gap: '5px '}}>
                <AppIconButton icon={<FaList/>} selected={state.view ==='list'} onClick={() => handleView('list')}/>
                <AppIconButton icon={<FaTh />} selected={state.view === 'icon'} onClick={() => handleView('icon')}/>
              </div>}
              {/* <AppIconButton icon={<BsGearFill/>} />  */}
            </div>

            {(state.isLoading && state.firstFetch) && <SkeletonTable />}
            {!state.isLoading && singleType && (
                    <Formik {...formikParams}>
                      {(props) => (
                        <Form>
                          {Object.keys(state.values).length === 0 && 
                          <>
                            <div className="d-flex flex-row mx-0 my-0 px-0 py-0"> 
                          <p className="general-input-title-slug"> Slug </p> 
                          <GeneralHoverTooltip 
                            icon={<RiQuestionLine className="general-input-title-slug-icon"/>}
                            className="general-table-header-slug"
                            tooltipText={slugTooltipText}
                            position="left"
                          /> 
                          </div>
                          <Field
                            name="slug"
                            validate={(e) => TypesValidator(e, "text")}
                          >
                            {({ field, meta }) => (
                              <div>
                                <input
                                  type="text"
                                  {...field}
                                  className={classname("general-input-text", {"general-input-error" : meta.touched && meta.error})}
                                  style={
                                    meta.touched && meta.error
                                      ? {
                                          borderColor: "red",
                                          outlineColor: "red",
                                        }
                                      : {}
                                  }
                                />
                                {meta.touched && meta.error && (
                                  <div className="general-input-error-text">
                                    {meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                          </>}
                          {Object.entries(attributes)
                            .sort(sortByOrderAsc)
                            .map(([attributeName, attribute]) => {
                              return (
                                <div key={attributeName}>
                                  <p className="general-input-title"> {attributeName.replaceAll('_', " ")}  </p>
                                  <AdminRenderer
                                    errors={props.errors}
                                    touched={props.touched}
                                    type={attribute.type}
                                    name={attributeName}
                                    disabled={!capabilities.includes(writeContents)}
                                  />
                                </div>
                              );
                            })}
                        </Form>
                      )}
                    </Formik>
                  )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && state.view === 'list' && !singleType &&  (
              <AppContentManagerTable
                columns={state.columns}
                entries={state.values}
                entity_type_slug={entity_type_slug}
              />
            )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && state.view === 'icon' && !singleType && (
              <AppContentManagerTableIconView
                columns={state.columns}
                entries={state.values}
                entity_type_slug={entity_type_slug}
              />
            )}
            {(state.firstFetch ? !state.isLoading : !state.firstFetch) && !singleType && (
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
          {!state.isLoading && singleType && 
            <div className="d-flex flex-row justify-content-center">
              {capabilities.includes(writeContents) && <>
              <AppButtonLg
                title="Cancel"
                onClick={!state.isSaving ? () => router.push(`/admin/content-manager/${entity_type_slug}`) : null}
                className="general-button-cancel mb-3"
              />
              <AppButtonLg
                title={state.isSaving ? "Saving" : "Save"}
                icon={state.isSaving ? <AppButtonSpinner /> : <FaCheck className="general-button-icon"/>}
                onClick={!state.isSaving ? onSubmit : null}
                className="general-button-save mb-3"
              /></>}
            </div>}
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
                  <AppInfoModal
            show={state.show}
            onClose={() => (
              dispatch({ type: SET_SHOW, payload: false }),
              router.reload()
            )}
            modalTitle="Success"
            buttonTitle="Close"
          >
            {" "}
            {state.modalContent}{" "}
          </AppInfoModal>
        </ContentManagerLayout>
      </div>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
