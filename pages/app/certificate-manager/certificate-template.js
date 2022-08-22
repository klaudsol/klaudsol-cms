import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useReducer,
} from "react";
import InnerLayout from "@/components/layouts/InnerLayout";
import { useFadeEffect, slsFetch } from "@/components/Util";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import uuid from "uuid";
import { FaTrash, FaEdit, FaWindowClose, FaSave, FaPlus } from "react-icons/fa";
import { Overlay } from "react-portal-overlay";
import Link from "next/link";
import SkeletonEditCertificate from "@/components/certificate/SkeletonEditCertificate";
import styles from "@/styles/certificates/certificate-view/CertificateViewLayout.module.scss";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert,
} from "@coreui/react";

export default function Certificates({ cache }) {
  // initilaize contents
  const initialState = {
    isLoading: false,
    isRefresh: true,
  };
  // using a reducer to change / alter UI when tasks are running / idle
  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return {
          ...state,
          isLoading: true,
        };
      case "CLEANUP":
        return {
          ...state,
          isLoading: false,
          isRefresh: false,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  //calls data to the database
  const fetchData = useCallback(() => {
    setLoading(true);
    (async () => {
      try {
        dispatch({ type: "LOADING" });

        const availableTemplates = await slsFetch(
          "/api/app/certificate/templates",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const templates_available = await availableTemplates.json();
        setAvailableTemplates(templates_available);
        console.log(templates_available);
      } catch (error) {
        alert(error);
      } finally {
        dispatch({ type: "CLEANUP" });
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [availableTemplates, setAvailableTemplates] = useState([]); //template id
  const [selectedTemplateID, setSelectedTemplateID] = useState(null); //template id
  const [selectedName, setSelectedName] = useState(""); //filename of the certificate
  const [open, setOpen] = useState(false); //from edit prompt
  const [loading, setLoading] = useState(false); //when data is loading from the database
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("There has been an error");
  const [successMessage, setSuccessMessage] = useState("Success!");

  function successPrompt() {
    return (
      <>
        <CAlert
          color="success"
          dismissible
          visible={isSuccess}
          onClose={() => setIsSuccess(false)}
        >
          {successMessage}
        </CAlert>
      </>
    );
  }
  function errorPrompt() {
    return (
      <>
        <CAlert
          color="danger"
          dismissible
          visible={isError}
          onClose={() => setIsError(false)}
        >
          {errorMessage}
        </CAlert>
      </>
    );
  }

  //when delete form is submitted
  //using recipient_id, the recipient will be
  //deleted from the database
  const onclk_delete = useCallback(
    (selectedTemplateID) => {
      var id = selectedTemplateID;
      (async () => {
        try {
          dispatch({ type: "LOADING" });
          const response = await slsFetch("/api/app/certificate/templates", {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ id }),
          });
          if (response.status == "200") {
            setDeletePrompt(false);
            setSuccessMessage("Template successfully deleted!");
            setIsSuccess(true);
          } else {
            setErrorMessage("There has been an error in deleting, try again!");
            setIsError(true);
          }
          fetchData();
        } catch (ex) {
          alert(ex.stack);
        } finally {
          dispatch({ type: "CLEANUP" });
        }
      })();
    },
    [fetchData]
  );

  /* DELETING CERTIFICATE FUNCTION */
  const [deletePrompt, setDeletePrompt] = useState(false);
  const deleteRecipient = (template_id) => {
    //gets the recipient_id to be deleted
    setSelectedTemplateID(template_id);
  };

  const deleteRecipientDatabase = (selectedTemplateID) => {
    onclk_delete(selectedTemplateID);
  };

  //to be shown when delete button is clicked
  function deleteModal() {
    return (
      <CModal
        portal={false}
        visible={deletePrompt}
        onClose={() => setDeletePrompt(false)}
      >
        <CModalHeader onClose={() => setDeletePrompt(false)}>
          Delete {selectedName}
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this?</CModalBody>
        <CModalFooter>
          {state.isLoading ? (
            <p style={{ color: "gray" }}>loading </p>
          ) : (
            <>
              <CButton
                color="danger"
                onClick={() => {
                  deleteRecipientDatabase(selectedTemplateID); //will call the deletion on the database
                }}
              >
                YES
              </CButton>
              <CButton color="secondary" onClick={() => setDeletePrompt(false)}>
                Cancel
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>
    );
  }

  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout>
        {state.isLoading && <SkeletonEditCertificate></SkeletonEditCertificate>}
        {!state.isLoading && (
          <div className={styles["certificate-view-holder"]}>
            {deleteModal()}
            <h3>Templates</h3>{" "}
            <Link
              href={`/app/certificate-manager/certificate-template/create-template`}
              passHref={true}
            >
              <button className="cert-add-btn">Add Template</button>
            </Link>
            <hr />
            {errorPrompt()}
            {successPrompt()}
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Template</CTableHeaderCell>
                  <CTableHeaderCell>No. of Certificates</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {availableTemplates.map((item, i) => {
                  return (
                    <CTableRow key={i}>
                      <CTableDataCell>{item.id}</CTableDataCell>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <CTableDataCell>{item.certificate_count}</CTableDataCell>
                      <Link
                        href={`/app/certificate-manager/certificate-template/${item.id}`}
                        passHref={true}
                      >
                        <button className="cert-edit-btn">
                          <FaEdit />{" "}
                        </button>
                      </Link>
                      <button className="cert-del-btn">
                        <FaTrash
                          onClick={
                            item.certificate_count == 0
                              ? () => {
                                  deleteRecipient(item.id);
                                  setSelectedName(item.title);
                                  setDeletePrompt(!deletePrompt);
                                }
                              : () => {
                                  setErrorMessage(
                                    "Cannot delete templates with existing certificates/recipients"
                                  );
                                  setIsError(true);
                                }
                          }
                        />
                      </button>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </div>
        )}
      </InnerLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
