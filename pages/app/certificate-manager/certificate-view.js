import React, { useState, useCallback, useRef, useEffect } from "react";
import InnerLayout from "@/components/layouts/InnerLayout";
import { useFadeEffect, slsFetch } from "@/components/Util";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import uuid from "uuid";
import { FaTrash, FaEdit, FaWindowClose, FaSave, FaPlus } from "react-icons/fa";
import { Overlay } from "react-portal-overlay";
import SkeletonEditCertificate from "@/components/certificate/SkeletonEditCertificate";
import styles from "@/styles/certificates/certificate-view/CertificateViewLayout.module.scss";
import Link from "next/link";
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
  CSpinner,
  CAlert,
  CFooter,
} from "@coreui/react";

export default function Certificates({ cache }) {
  //calls data to the database
  const fetchData = useCallback(() => {
    setLoading(true);
    (async () => {
      try {
        const availableCertificates = await slsFetch(
          "/api/app/certificate/certificates",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const certificates_available = await availableCertificates.json();
        console.log("FROM GET CERTIFICATE >>>");
        console.log(certificates_available);
        setAvailableCertificates(certificates_available);
        const availableTemplates = await slsFetch(
          "/api/app/certificate/templates",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const certificates_template = await availableTemplates.json();
        setAvailableTemplates(certificates_template);
        setSelectedTemplateID(certificates_template[0].id);
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //loads the parameters needed for selecting a certificate
  const fetchDataParams = (property) =>
    Object.fromEntries(
      Object.entries({ id: property ?? null }).filter(([key, value]) => value)
    );

  //fetching a selected certificate
  const fetchSelectedCertificate = async (id) => {
    try {
      setIsFetching(true);
      const selectCertificate = await slsFetch(
        `/api/app/certificate/certificates/?${new URLSearchParams(
          fetchDataParams(id)
        )}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      // const select_certificate = await slsFetch(
      //   `/api/app/certificate/get_properties/?${new URLSearchParams(
      //     fetchDataParams(id)
      //   )}`
      // );
      const selected_certificate = await selectCertificate.json();
      setSelectedCertificate(selected_certificate);

      //display a page here that will ask for editting fields
    } catch (error) {
      alert(error);
    } finally {
      setIsFetching(false);
    }
  };

  function onEdit(id, template_id, certificate_name, template_name) {
    //when edit is clicked, this will be called to fetch the data of the
    //selected certificate

    setSelectedCertificate([]);
    fetchSelectedCertificate(id);
    setSelectedTemplate(template_name); //string
    setSelectedTemplateID(template_id); //int
    setSelectedName(certificate_name); //string
    setSelectedRecipientID(id); //recipient_id in database
    setOpen(true);
    //call a screen that will display editable fields
  }

  const changeTemplateID = (e) => {
    setSelectedTemplateID(e.target.value);
  };

  const changeName = (e) => {
    setSelectedName(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [availableCertificates, setAvailableCertificates] = useState([]); //all the certificate recipients
  const [availableTemplates, setAvailableTemplates] = useState([]); // the available templates
  const [selectedCertificate, setSelectedCertificate] = useState([]); //the selected certificate on edit and delete
  const [selectedTemplate, setSelectedTemplate] = useState(null); // template name
  const [selectedTemplateID, setSelectedTemplateID] = useState(null); //template id
  const [selectedName, setSelectedName] = useState(""); //filename of the certificate
  const [open, setOpen] = useState(false); //from edit prompt
  const [selectedRecipientID, setSelectedRecipientID] = useState(null); //recipient id
  const [loading, setLoading] = useState(false); //when data is loading from the database
  const [isFetching, setIsFetching] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("There has been an error");
  const [successMessage, setSuccessMessage] = useState("Success!");
  const handleChangeArrKey = (e) => {
    // porperty array KEY changes
    e.preventDefault();

    const index = e.target.id;
    setSelectedCertificate((s) => {
      const newArr = s.slice();
      newArr[index]._key = e.target.value;
      return newArr;
    });
  };

  const handleChangeArrValue = (e) => {
    // porperty array VALUE changes
    e.preventDefault();

    const index = e.target.id;
    setSelectedCertificate((s) => {
      const newArr = s.slice();
      newArr[index]._value = e.target.value;
      return newArr;
    });
  };

  const removeInputFields = (index) => {
    //remove input fields from "key-value" section
    const rows = [...selectedCertificate];
    rows.splice(index, 1);
    setSelectedCertificate(rows);
  };

  const addInput = (e) => {
    //will add the key-value pair
    e.preventDefault();
    //add property fields on other details
    setSelectedCertificate((s) => {
      return [
        ...s,
        {
          template_id: selectedTemplateID,
          _key: "",
          _value: "",
        },
      ];
    });
  };

  function onSaveEdit(e) {
    //when saving the edited fields
    e.currentTarget.disabled = true;
    setLoading(true);

    editCertificate(
      selectedRecipientID,
      selectedTemplateID,
      selectedName,
      selectedCertificate
    );
  }

  // when edit form is submitted.
  // selectedRecipientID -  to find from app_certificate_recipients used as id
  // selectedTemplateID -  to edit template_id of a row from app_certificate_recipients
  // selectedName - to edit certificate_name of a row from app_certificate_recipients
  // selectedCertificate - to insert key value pairs from app_certificate_recipient_properties
  const editCertificate = useCallback(
    (
      selectedRecipientID,
      selectedTemplateID,
      selectedName,
      selectedCertificate
    ) => {
      (async () => {
        try {
          const response = await slsFetch("/api/app/certificate/certificates", {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              selectedRecipientID,
              selectedTemplateID,
              selectedName,
              selectedCertificate,
            }),
          });

          if (response.status == "200") {
            setSuccessMessage("Changes successfully saved!");
            setIsSuccess(true);
          } else {
            setErrorMessage(
              "There was an error on saving the certificate, please try again!"
            );
            setIsError(true);
          }
        } catch (ex) {
          alert(ex);
        } finally {
          fetchData();
          setLoading(false);
          setOpen(false);
        }
      })();
    },
    [fetchData]
  );

  //when delete form is submitted
  //using recipient_id, the recipient will be
  //deleted from the database
  const onclk_delete = useCallback(
    (selectedRecipientID) => {
      var id = selectedRecipientID;
      (async () => {
        try {
          // dispatch({type: 'LOADING'});
          const response = await slsFetch("/api/app/certificate/certificates", {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ id }),
          });
          if (response.status == "200") {
            setDeletePrompt(false);
            setSuccessMessage("Certificate successfully deleted!");
            setIsSuccess(true);
          } else {
            setErrorMessage("Certificate is not deleted, please try again!");
            setIsError(true);
          }
          fetchData();
          setLoading(false);
        } catch (ex) {
          alert(ex.stack);
        }
      })();
    },
    [fetchData]
  );

  //when add form is submitted
  //selectedName = name of the certificate (like filename)
  // selectedTemplateID = temp id from template table
  //selected certificate = contains the credentials of key-value pairs
  const onclk_add = useCallback(
    (selectedName, selectedTemplateID, selectedCertificate) => {
      var template_id = selectedTemplateID;
      var certificate_name = selectedName;
      var certificate_id = uuid.v4();
      var certificate_properties = selectedCertificate;
      (async () => {
        try {
          setLoading(true);

          //dispatch({ type: "LOADING" });
          const response = await slsFetch("/api/app/certificate/certificates", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              template_id,
              certificate_name,
              certificate_id,
              certificate_properties,
            }),
          });
          if (response.status == "200") {
            setSuccessMessage("Certificate successfully saved!");
            setIsSuccess(true);
          } else {
            setSuccessMessage(
              "There has been an error in saving, please try again!"
            );
            setIsError(true);
          }
        } catch (ex) {
          alert(ex.stack);
        } finally {
          fetchData();
          setLoading(false);
          setAddPrompt(false);
        }
      })();
    },
    [fetchData]
  );

  const keyDown = (e) => {
    //prevent space bar for property values, as property will be js variables
    var e = window.event || e;
    var key = e.keyCode;
    //space pressed
    if (key == 32) {
      //space
      e.preventDefault();
    }
  };

  /* DELETING CERTIFICATE FUNCTION */
  const [deletePrompt, setDeletePrompt] = useState(false);
  const deleteRecipient = (recipient_id) => {
    //gets the recipient_id to be deleted
    setSelectedRecipientID(recipient_id);
  };

  const deleteRecipientDatabase = (selectedRecipientID) => {
    setLoading(true);
    onclk_delete(selectedRecipientID);
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
          {loading ? (
            <p style={{ color: "gray" }}>loading </p>
          ) : (
            <>
              <CButton
                color="danger"
                onClick={() => {
                  deleteRecipientDatabase(selectedRecipientID); //will call the deletion on the database
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

  /* ADDING CERTIFICATE FUNCTION */
  const [addPrompt, setAddPrompt] = useState(false);
  const addRecipientDatabase = () => {
    if (selectedName == "") {
      alert("Please insert certificate name");
    } else {
      onclk_add(selectedName, selectedTemplateID, selectedCertificate);
    }
  };

  //to be shown when add certificate button is clicked is clicked
  function addModal() {
    return (
      <CModal
        portal={false}
        visible={addPrompt}
        onClose={() => setAddPrompt(false)}
        size="xl"
      >
        <CModalHeader onClose={() => setAddPrompt(false)}>
          <h3>Add a Certificate</h3>
        </CModalHeader>
        <CModalBody>
          <div className={styles["certificate-view-holder"]}>
            <div className={styles["header-ctnr"]}>
              <table>
                <tr>
                  <td>Certificate Name</td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      placeholder={"Certificate for"}
                      value={selectedName}
                      onChange={changeName}
                      style={{ width: "350px" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Template</td>
                  <td>
                    <select
                      className={styles["template-dropdown"]}
                      onChange={changeTemplateID}
                      value={selectedTemplateID}
                    >
                      {availableTemplates.map((certTemplate, i) => {
                        return (
                          <option key={i} value={certTemplate.id}>
                            {certTemplate.title}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
              </table>
              <div className={styles["keyValue-ctnr"]}>
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Value</th>
                      <button
                        className="certgen-btn"
                        onClick={addInput}
                        style={{ width: 25, height: 25 }}
                        type="submit"
                      >
                        +
                      </button>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCertificate.map((certificate, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <input
                              onChange={handleChangeArrKey}
                              value={certificate._key}
                              id={i}
                              type="text"
                              size="40"
                              onKeyDown={keyDown}
                            />
                          </td>
                          <td>
                            <input
                              onChange={handleChangeArrValue}
                              value={certificate._value}
                              id={i}
                              type="text"
                              size="40"
                            />
                          </td>
                          <button
                            className="btn_delete"
                            onClick={() => removeInputFields(i)}
                          >
                            <FaTrash />
                          </button>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <i style={{ color: "red" }}>*no spaces on key names</i>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          {loading ? (
            <p style={{ color: "gray" }}>loading </p>
          ) : (
            <>
              <CButton
                color="success"
                onClick={() => {
                  addRecipientDatabase(); //will call the addition on the database
                }}
              >
                SAVE
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>
    );
  }
  function editModal() {
    return (
      <CModal
        portal={false}
        visible={open}
        onClose={() => setOpen(false)}
        size="xl"
      >
        <CModalHeader onClose={() => setAddPrompt(false)}>
          <h3>Edit {selectedName}</h3>
        </CModalHeader>
        <CModalBody>
          <div>
            <table>
              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder={selectedName}
                    value={selectedName}
                    onChange={changeName}
                    style={{ width: "350px" }}
                  />
                </td>
              </tr>
              <tr>
                <td>Template</td>
                <td>
                  <select
                    className={styles["template-dropdown"]}
                    onChange={changeTemplateID}
                    value={selectedTemplateID}
                  >
                    {availableTemplates.map((certTemplate, i) => {
                      return (
                        <option key={i} value={certTemplate.id}>
                          {certTemplate.title}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            </table>
          </div>
          <div className={styles["keyValue-ctnr"]}>
            {isFetching ? (
              <CSpinner />
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Value</th>
                      <button
                        className="certgen-btn"
                        onClick={addInput}
                        style={{ width: 25, height: 25 }}
                        type="submit"
                      >
                        +
                      </button>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCertificate.map((certificate, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <input
                              onChange={handleChangeArrKey}
                              value={certificate._key}
                              id={i}
                              type="text"
                              size="40"
                              onKeyDown={keyDown}
                            />
                          </td>
                          <td>
                            <input
                              onChange={handleChangeArrValue}
                              value={certificate._value}
                              id={i}
                              type="text"
                              size="40"
                            />
                          </td>
                          <button
                            className="btn_delete"
                            onClick={() => removeInputFields(i)}
                          >
                            <FaTrash />
                          </button>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <i style={{ color: "red" }}>*no spaces on key names</i>
              </>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          {loading ? (
            <p style={{ color: "gray" }}>loading </p>
          ) : (
            <button
              className={styles["btn_save"]}
              onClick={(e) => onSaveEdit(e)}
            >
              SUBMIT
            </button>
          )}
        </CModalFooter>
      </CModal>
    );
  }
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
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout>
        {loading && <SkeletonEditCertificate></SkeletonEditCertificate>}
        {!loading && (
          <div className={styles["certificate-view-holder"]}>
            {deleteModal()}
            {addModal()}
            {editModal()}
            {successPrompt()}
            {errorPrompt()}
            {/* <Overlay
              className={styles["edit-form"]}
              open={open}
              onClose={() => setOpen(false)}
            >
              <div className={styles["certificate-view-holder"]}>
                <div className={styles["edit-form-ctnr"]}>
                  <div className={styles["editform"]}>
                    <div className={styles["edit-header"]}>
                      <h4 className={styles["caption"]}>Edit Certificate</h4>
                      <button
                        className={styles["exit_btn"]}
                        onClick={() => setOpen(false)}
                      >
                        <FaWindowClose />
                      </button>
                    </div>
                    <div className={styles["header-ctnr"]}>
                      <table>
                        <tr>
                          <td>Name</td>
                          <td>
                            <input
                              type="text"
                              name="name"
                              placeholder={selectedName}
                              value={selectedName}
                              onChange={changeName}
                              style={{ width: "350px" }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Template</td>
                          <td>
                            <select
                              className={styles["template-dropdown"]}
                              onChange={changeTemplateID}
                              value={selectedTemplateID}
                            >
                              {availableTemplates.map((certTemplate, i) => {
                                return (
                                  <option key={i} value={certTemplate.id}>
                                    {certTemplate.title}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div className={styles["keyValue-ctnr"]}>
                      <table>
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <button
                              className="certgen-btn"
                              onClick={addInput}
                              style={{ width: 25, height: 25 }}
                              type="submit"
                            >
                              +
                            </button>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCertificate.map((certificate, i) => {
                            return (
                              <tr key={i}>
                                <td>
                                  <input
                                    onChange={handleChangeArrKey}
                                    value={certificate._key}
                                    id={i}
                                    type="text"
                                    size="40"
                                    onKeyDown={keyDown}
                                  />
                                </td>
                                <td>
                                  <input
                                    onChange={handleChangeArrValue}
                                    value={certificate._value}
                                    id={i}
                                    type="text"
                                    size="40"
                                  />
                                </td>
                                <button
                                  className="btn_delete"
                                  onClick={() => removeInputFields(i)}
                                >
                                  <FaTrash />
                                </button>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {loading ? (
                      <p style={{ color: "gray" }}>loading </p>
                    ) : (
                      <button
                        className={styles["btn_save"]}
                        onClick={(e) => onSaveEdit(e)}
                      >
                        SUBMIT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Overlay> */}

            <h3>Certificates</h3>
            <button
              className="cert-add-btn"
              onClick={() => {
                setAddPrompt(!addPrompt);
                setSelectedName("");
                setSelectedCertificate([]);
              }}
            >
              {" "}
              Add Certificate
            </button>

            <hr />
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Template</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {availableCertificates.map((item, i) => {
                  return (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        <Link
                          href={`/app/certificates/${item.certificate_id}`}
                          passHref={true}
                          style={{ textDecoration: "none" }}
                        >
                          {item.certificate_name}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <button
                        className="cert-edit-btn"
                        onClick={() =>
                          onEdit(
                            item.id,
                            item.template_id,
                            item.certificate_name,
                            item.title
                          )
                        }
                      >
                        <FaEdit />
                      </button>
                      <button className="cert-del-btn">
                        <FaTrash
                          onClick={() => {
                            deleteRecipient(item.id);
                            setSelectedName(item.certificate_name);
                            setDeletePrompt(!deletePrompt);
                          }}
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
