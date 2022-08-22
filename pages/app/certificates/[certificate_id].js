import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useReducer,
} from "react";
import InnerLayout from "@/components/layouts/InnerLayout";
import { CAlert } from "@coreui/react";
import {
  s3,
  bucketName,
  generateImageName,
} from "@/backend/data_access/certificate/S3";

import { useFadeEffect, slsFetch } from "@/components/Util";
import "react-datepicker/dist/react-datepicker.css";

import styles from "@/styles/certificates/certificate-template/CertificateTemplateLayout.module.scss";
import Image from "next/image";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import uuid from "uuid";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getSessionCache } from "@/lib/Session";
export default function CertificateGenerator({ cache }) {
  const router = useRouter();
  const { certificate_id } = router.query;

  //variables
  const [imgData, setImgData] = useState(null);
  const [imgCert, setImgCert] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [title, setTitle] = useState("");
  const printRef = React.useRef(); //used to point to the actual certificate display
  const [selectedCertificate, setSelectedCertificate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState([]);
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [certificateContent, setCertificateContent] = useState("");
  const [templateID, setTemplateID] = useState(null);
  const [properties, setProperties] = useState([]);
  const certificateID = certificate_id;

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

  useEffect(() => {
    (async () => {
      try {
        console.log("FETCHING >>>");
        dispatch({ type: "LOADING" });

        const fetchDataParams = Object.fromEntries(
          Object.entries({ certificate_id: certificate_id ?? null }).filter(
            ([key, value]) => value
          )
        );
        const certificateRaw = await slsFetch(
          `/api/app/certificate/certificates?${new URLSearchParams(
            fetchDataParams
          )}`
        );

        const certificate = await certificateRaw.json();
        setSelectedCertificate(certificate);
        console.log(certificate);
        setTitle(certificate[0].title);
        setCompanyName(certificate[0].company_name);
        setCompanyAddress(certificate[0].company_address);
        setTemplateID(certificate[0].template_id);
        setColor1(certificate[0].color1);
        setColor2(certificate[0].color2);
        setCertificateContent(certificate[0].body);
        setImgData(certificate[0].logo_img);
        setImgCert(certificate[0].bg_img);

        var _properties = certificate.map((certificate) => {
          return {
            ...certificate,
            key: `${"{" + certificate._key + "}"}`,
            value: certificate._value,
          };
        });
        //console.log("properties >>>");
        //console.log(_properties);
        var _body = certificate[0].body;
        console.log("BODY >>>>>");
        console.log(_body);
        _properties.map((property, i) => {
          _body = _body.replaceAll(property.key, property.value).toString();
          //console.log(_body);
        });
        setCertificateContent(_body);
      } catch (error) {
        alert(error);
      } finally {
        dispatch({ type: "CLEANUP" });
      }
    })();
  }, [certificate_id]);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 4 });
    const data = canvas.toDataURL("image/png");
    const certificateID = "601af4a5-3499-43d1-902b-ebf730d5c143";

    var doc = new jsPDF("landscape", "in", [11, 8.5]); // using defaults: orientation=portrait, unit=mm, size=A4
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    let widthRatio = width / canvas.width;
    let heightRatio = height / canvas.height;
    let ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    height = ratio * width;
    doc.addImage(
      data,
      "JPEG",
      0,
      0,
      canvas.width * ratio,
      canvas.height * ratio
    );
    doc.save(`${certificateID}.pdf`); //Download the rendered PDF.
  };

  function CertificateDisplay() {
    //displays the certificate itself
    return (
      <div className={styles["employee-certificate-holder"]}>
        <div className={styles["certificate-screen"]}>
          <div //PRINT PDF FROM HERE //NOTE: IF ERRORS OCCUR MOVE REF INTO CERTIFICATE-HOLDER
          >
            <div
              className={styles["certificate-holder"]}
              ref={printRef}
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
                    <Image src={imgData} alt="[logo]" layout="fill" />
                  ) : (
                    <Image
                      src={"/logo-180x180.png"}
                      alt="[logo]"
                      layout="fill"
                    />
                  )}
                </div>
                <div className={styles["companyName"]}>
                  <p style={{ color: color2 }}>{companyName}</p>
                </div>
                <div className={styles["companyLocation"]}>
                  <p style={{ color: color2 }}>{companyAddress}</p>
                </div>
              </div>
              <div className={styles["demo-bg"]}>
                {imgCert ? (
                  <Image src={imgCert} alt="" layout="fill" />
                ) : (
                  <Image layout="fill" src={"/klaudsol-logo.png"} alt="" />
                )}
              </div>
              <div className={styles["title-holder"]}>
                <h1>{title.toUpperCase()}</h1>
              </div>

              <div className={styles["para-holder"]}>
                <div className={styles["para"]}>
                  <div
                    dangerouslySetInnerHTML={{ __html: certificateContent }}
                  />
                </div>
              </div>

              <div className={styles["bottom-container"]}>
                <div className={styles["certID-container"]}>
                  <p>Certificate ID: {certificateID}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["submit-ctnr"]}>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className={styles["submit-btn"]}
          >
            Download as PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {properties.map((certificate, i) => {
        return (
          <>
            <p>
              {certificate.key} {certificate.value}
            </p>
          </>
        );
      })}
      {state.isLoading ? "" : CertificateDisplay()}
    </>
  );
}
export const getServerSideProps = getSessionCache();
