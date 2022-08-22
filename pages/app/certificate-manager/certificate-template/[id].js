import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useReducer,
} from "react";
import InnerLayout from "@/components/layouts/InnerLayout";
import { CAlert, CButton } from "@coreui/react";
import {
  s3,
  bucketName,
  generateImageName,
} from "@/backend/data_access/certificate/S3";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import { useFadeEffect, slsFetch } from "@/components/Util";
import "react-datepicker/dist/react-datepicker.css";

import styles from "@/styles/certificates/certificate-template/CertificateTemplateLayout.module.scss";
import Image from "next/image";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import uuid from "uuid";
import { useRouter } from "next/router";
export default function CertificateGenerator({ cache }) {
  const router = useRouter();
  const { id } = router.query;
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
  // initializing state for useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(() => {
    (async () => {
      try {
        console.log("FETCHING >>>");
        dispatch({ type: "LOADING" });
        const fetchDataParams = Object.fromEntries(
          Object.entries({ id: id ?? null }).filter(([key, value]) => value)
        );
        const templateRaw = await slsFetch(
          `/api/app/certificate/templates?${new URLSearchParams(
            fetchDataParams
          )}`
        );
        const template = await templateRaw.json();
        setSelectedTemplate(template);
        console.log(template);

        setFormValues((formValues) => {
          return {
            ...formValues,
            ["title"]: template[0].title,
            ["companyName"]: template[0].company_name,
            ["location"]: template[0].company_address,
          };
        });
        setColor1(template[0].color1);
        setColor2(template[0].color2);
        setCertificateContent(template[0].body);
        setLogo(template[0].logo_img);
        setImgData(template[0].logo_img);

        setCertbg(template[0].bg_img);
        setImgCert(template[0].bg_img);
      } catch (error) {
        alert(error);
      } finally {
        dispatch({ type: "CLEANUP" });
      }
    })();
  }, [id]);

  useEffect(() => {
    fetchData();
    return () => {
      URL.revokeObjectURL(imgData);
    };
  }, [fetchData, imgData]);

  const editTemplateDB = useCallback(
    (id, logo, certbg, formValues, certificateContent, color1, color2) => {
      console.log(id, logo, certbg, formValues, certificateContent);

      var title = formValues.title;
      var company_name = formValues.companyName;
      var company_address = formValues.location;
      var body = certificateContent;
      var logo_img = logo;
      var bg_img = certbg;

      (async () => {
        try {
          console.log("change logo?" + isChangeLogo);
          console.log("change bg?" + isChangeBg);
          dispatch({ type: "LOADING" });
          var logo_location = logo;
          var bg_location = certbg;
          if (isChangeLogo) {
            var ext = logo_img.name.split(".").pop();
            console.log("with logo");
            const dataLogo = await s3
              .upload({
                Bucket: bucketName,
                Key: await generateImageName(ext),
                Body: logo_img,
                ContentType: logo_img.type,
              })
              .promise();

            logo_location = dataLogo.Location;
          }
          console.log("logo type>>>>" + logo_img.type);

          if (isChangeBg) {
            console.log("with backgoround");
            var ext = bg_img.name.split(".").pop();
            const dataBG = await s3
              .upload({
                Bucket: bucketName,
                Key: await generateImageName(ext),
                Body: bg_img,
                ContentType: bg_img.type,
              })
              .promise();

            bg_location = dataBG.Location;
          }

          const response = await slsFetch("/api/app/certificate/templates", {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              id,
              title,
              company_name,
              company_address,
              body,
              logo_location,
              bg_location,
              color1,
              color2,
            }),
          });
          if (response.status == "200") {
            setSuccessMessage("Changes succesfully saved!");
            setIsSuccess(true);
          } else {
            setErrorMessage("There was an error, Please try again!");
            setIsError(true);
          }
        } catch (ex) {
          alert(ex);
        } finally {
          dispatch({ type: "CLEANUP" });
        }
      })();
    },
    [isChangeLogo, isChangeBg]
  );
  const initialValues = {
    title: "",
    companyName: "",
    location: "",
  };

  const [active, setActive] = useState(0); //used for tab panels
  const [certificateID, setCertificateID] = useState(uuid.v4()); //uuid generator for certificateID
  const [logo, setLogo] = useState(null); //logo changer
  const [imgData, setImgData] = useState("/logo-180x180.png");
  const [isChangeLogo, setIsChangeLogo] = useState(false);
  const [certbg, setCertbg] = useState(null); //certificate background changer
  const [imgCert, setImgCert] = useState("/klaudsol-logo.png"); // certificate image background
  const [isChangeBg, setIsChangeBg] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false); //indicates if form is submitted
  const printRef = React.useRef(); //used to point to the actual certificate display
  const [certificateContent, setCertificateContent] = useState(null); //content for the actual certificate body
  const [isPropSubmit, setIsPropSubmit] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState([]);

  const propertyArr = [
    //contains the properties of certificates
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];

  const [propertyArray, setPropertyArr] = useState(propertyArr); //properties of certificates (e.g. start_date)
  const [color1, setColor1] = useState("#FBFFDB"); //use for certificate bg
  const [color2, setColor2] = useState("#282900");

  const stylePrompt = (e) => {
    //font styles of properties, asked whenever property is inserted in the body
    e.preventDefault();
    confirmAlert({
      title: "Style",
      message: "Select style of text",
      buttons: [
        {
          label: "Bold",
          onClick: () => appendHTML("bold", e), //appendHTML calls a func to insert html contents
        },
        {
          label: "Italic",
          onClick: () => appendHTML("italic", e),
        },
        {
          label: "Underline",
          onClick: () => appendHTML("underline", e),
        },
        {
          label: "None",
          onClick: () => appendHTML("none", e),
        },
      ],
    });
  };
  const appendHTML = (style, e) => {
    //this is called for appending values in the body
    //will be using dangerouslySetInnerHTML
    /*
     * 1. Users will add property
     * 2. each property will create a button
     * 3. when that button is clicked, it will be added to the body string
     * 4. the body string contains the contents of the certificate
     */

    //will select the style of the text
    if (style == "bold") {
      setCertificateContent(certificateContent + `<b>{${e.target.id}}</b>`);
    } else if (style == "italic") {
      setCertificateContent(certificateContent + `<i>{${e.target.id}}</i> `);
    } else if (style == "underline") {
      setCertificateContent(certificateContent + `<u>{${e.target.id}}</u> `);
    } else {
      setCertificateContent(certificateContent + "{" + e.target.id + "}");
    }
  };

  const insertParagraph = (e) => {
    //add new space as "new paragraph"
    e.preventDefault();
    setCertificateContent(certificateContent + "<br/><br/>");
  };

  const addInput = (e) => {
    //will add the properties in certs

    e.preventDefault();
    //add property fields on other details
    setPropertyArr((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
  };

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
  const removeInputFields = (index) => {
    //remove input fields from "details" section
    const rows = [...propertyArray];

    rows.splice(index, 1);
    setPropertyArr(rows);
  };

  const handleChangeArr = (e) => {
    //property array changes
    e.preventDefault();

    const index = e.target.id;
    setPropertyArr((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
  };

  const handleChange = (e) => {
    //form values changes
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    //to validate all data entry
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const onChangePicture = (e) => {
    //set the header logo
    if (e.target.files[0]) {
      setLogo(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
      setIsChangeLogo(true);
    }
  };

  const onChangeBackground = (e) => {
    //set the background image
    if (e.target.files[0]) {
      setCertbg(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgCert(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
      setIsChangeBg(true);
    }
  };

  const validate = (values) => {
    //validate form values, should not be null
    const errors = {};
    if (!values.title) {
      errors.title = "Certificate title is required";
    }
    if (!values.companyName) {
      errors.companyName = "Company name is required";
    }
    if (!values.location) {
      errors.location = "Company address is required";
    }
    return errors;
  };

  const propertyBtnAction = (e) => {
    /**
     * properties should not be editable whenever the content is being editted
     * to avoid errors, property fields is not displayed when user "submitted" the properties
     */

    setIsPropSubmit(!isPropSubmit);
    setCertificateContent("");
  };

  /*************** DISPLAYS *****************/
  function showProperties() {
    //will only show clickable buttons when properties are already submitted
    return isPropSubmit ? (
      <>
        {propertyArray.map((item, i) => {
          return (
            <button
              key={i}
              id={item.value}
              onClick={stylePrompt}
              className={"property-btn"}
            >
              {item.value}
            </button>
          );
        })}
        <button
          id={"new paragraph"}
          onClick={insertParagraph}
          className={"newpara-btn"}
        >
          new paragraph
        </button>
      </>
    ) : (
      ""
    );
  }
  function showPropertyFields() {
    //will show the inputs only when not yet submitted
    return !isPropSubmit ? (
      <>
        {propertyArray.map((item, i) => {
          return (
            <tr key={i}>
              <input
                onChange={handleChangeArr}
                value={item.value}
                id={i}
                type={item.type}
                size="40"
                onKeyDown={keyDown}
              />
              <button
                className="certgen-btn"
                onClick={() => removeInputFields(i)}
              >
                delete
              </button>
            </tr>
          );
        })}
      </>
    ) : (
      ""
    );
  }

  function CertificateDisplay() {
    //displays the certificate itself
    return (
      <>
        <div //PRINT PDF FROM HERE //NOTE: IF ERRORS OCCUR MOVE REF INTO CERTIFICATE-HOLDER
          ref={printRef}
          className={styles["employee-certificate-holder"]}
        >
          <div
            className={styles["certificate-holder"]}
            style={{
              backgroundColor: color1,
              border: `.40rem solid ${color2}`,
            }}
          >
            <div className={styles["header-container"]}>
              <div
                style={{
                  position: "relative",
                }}
                className={styles["logo-container"]}
              >
                {imgData ? (
                  <Image
                    src={imgData}
                    alt=""
                    layout="fill"
                    objectFit="contain"
                  />
                ) : (
                  <Image
                    src={"/logo-180x180.png"}
                    alt=""
                    layout="fill"
                    objectFit="contain"
                  />
                )}
              </div>
              <div className={styles["companyName"]}>
                <p style={{ color: color2 }}>{formValues.companyName}</p>
              </div>
              <div className={styles["companyLocation"]}>
                <p style={{ color: color2 }}>{formValues.location}</p>
              </div>
            </div>
            <span className={styles["demo-bg"]}>
              {imgCert ? (
                <Image width="700" height="700" src={imgCert} alt="" />
              ) : (
                <Image
                  width="700"
                  height="700"
                  src={"/klaudsol-logo.png"}
                  alt=""
                />
              )}
            </span>
            <div className={styles["title-holder"]}>
              <h1>{formValues.title.toUpperCase()}</h1>
            </div>

            <div className={styles["para-holder"]}>
              <div className={styles["para"]}>
                <div dangerouslySetInnerHTML={{ __html: certificateContent }} />
              </div>
            </div>

            <div className={styles["bottom-container"]}>
              <div className={styles["certID-container"]}>
                <p>Certificate ID: {certificateID}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
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
  function CertificateTab() {
    //display the form for certificate
    return (
      <>
        <div className="generatorContainer">
          <form onSubmit={handleSubmit}>
            <h1>Certification</h1>
            {successPrompt()}
            {errorPrompt()}
            <div className="ui divider"></div>
            <div className="ui form">
              <h4>Header</h4>
              Logo image
              <br />
              <input type="file" onChange={onChangePicture} />
              <br />
              <br />
              <div className="field">
                <label>Title</label>
                <p></p>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formValues.title}
                  onChange={handleChange}
                  style={{ width: "350px" }}
                />
              </div>
              <p className="err">{formErrors.title}</p>
              <div className="field">
                <label>Company name</label>
                <p></p>
                <input
                  type="text"
                  name="companyName"
                  placeholder="company name"
                  value={formValues.companyName}
                  onChange={handleChange}
                  style={{ width: "350px" }}
                />
              </div>
              <p className="err">{formErrors.companyName}</p>
              <div className="field">
                <label>Company address</label>
                <p></p>
                <input
                  type="text"
                  name="location"
                  placeholder="company address"
                  value={formValues.location}
                  onChange={handleChange}
                  style={{ width: "350px" }}
                />
              </div>
              <p className="err">{formErrors.location}</p>
              <hr />
            </div>
          </form>
          <h4>Body</h4>
          <>
            <div>
              <b>Properties</b>{" "}
              {!isPropSubmit ? (
                <button
                  className="certgen-btn"
                  onClick={addInput}
                  style={{ width: 25, height: 25 }}
                  type="submit"
                >
                  +
                </button>
              ) : (
                ""
              )}
              <br />
              {!isPropSubmit ? (
                <i style={{ color: "red" }}>space character is not allowed</i>
              ) : (
                <i style={{ color: "red" }}>
                  editing will clear the current content
                </i>
              )}
              <table>
                <td>{showPropertyFields()}</td>
              </table>
              <button
                className="submit-prop-btn"
                onClick={() => propertyBtnAction()}
                type="submit"
              >
                {isPropSubmit ? "Edit Properties" : "Submit Properties"}
              </button>
            </div>
            <hr />
            <b>Paragraph</b>
            <br />
            {showProperties()}
            <br />
            <b>Content</b>
            <p>Enclose all properties using brackets {"{}"}</p>
            <p>Do not include spacing on the properties inside the bracket</p>
            <p>
              For text alignment, enclose text with{" "}
              {"<p style = 'text-align:right/left/center'> text </p>"}
            </p>
            <br />
            <textarea
              className="content-field"
              name="certificateContent"
              placeholder="click on the buttons above to include properties"
              value={certificateContent}
              onChange={(e) => setCertificateContent(e.target.value)}
            />
            <div>
              Theme
              <br />
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
              />
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
              />
            </div>
            <br />
            Background image
            <br />
            <input type="file" onChange={onChangeBackground} />
            <br />
            <br />
          </>
        </div>

        <div className="certificate-scroller">{CertificateDisplay()}</div>
        <div className="cert-submit-ctnr">
          <button
            className="cert-submit-btn cert-add-btn"
            disabled={state.isLoading}
            onClick={() =>
              editTemplateDB(
                id,
                logo,
                certbg,
                formValues,
                certificateContent,
                color1,
                color2
              )
            }
          >
            {state.isLoading ? "loading . . ." : "SUBMIT EDIT"}
          </button>
        </div>
      </>
    );
  }

  /****************** PANEL TABS******************/
  const tabItems = [
    {
      id: 1,
      title: "Certificate Generator",
      content: CertificateTab(),
    },
    {
      id: 2,
      title: "View Template",
      content: CertificateDisplay(),
    },
  ];
  const TabItemComponent = ({
    icon = "",
    title = "",
    onItemClicked = () =>
      console.error("You passed no action to the component"),
    isActive = false,
  }) => {
    return (
      <div
        className={isActive ? "tabitem" : "tabitem tabitem--inactive"}
        onClick={onItemClicked}
      >
        <i className={icon}></i>
        <p className="tabitem__title">{title}</p>
      </div>
    );
  };

  /**************** MAIN RETURN FUNCTION *******************/
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout>
        {!state.isLoading && (
          <>
            <div className="tabs">
              {tabItems.map(({ id, icon, title }) => (
                <TabItemComponent
                  key={title}
                  icon={icon}
                  title={title}
                  onItemClicked={() => setActive(id)}
                  isActive={active === id}
                />
              ))}
            </div>
            {tabItems.map(({ id, content }) => {
              return active === id ? content : "";
            })}
          </>
        )}
        {state.isLoading && (
          <>
            <div className="tabs">
              <TabItemComponent key={1} title={"Loading . . ."} />
              <TabItemComponent key={2} title={"Loading . . ."} />
            </div>
          </>
        )}
      </InnerLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
