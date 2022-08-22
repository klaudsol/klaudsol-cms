import React, { useState, useCallback, useRef, useEffect } from "react";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import styles from "@/styles/certificates/intern/InternCertificateLayout.module.scss";
export default function Certificate({ cache }) {
  const printRef = React.useRef();

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

  return (
    <CacheContext.Provider value={cache}>
      <div className={styles["intern-certificate-holder"]}>
        <div className={styles["screen-bg"]}>
          <div className={styles["certificate-screen"]}>
            <div ref={printRef} className={styles["certificate"]}>
              <div className={styles["certificate-content"]}>
                <div className={styles["certificate-info"]}>
                  <span className={styles["demo-bg"]}>
                    <Image
                      width="700"
                      height="700"
                      src="/klaudsol-logo.png"
                      alt=""
                    />
                  </span>
                  <span className={styles["company-logo"]}>
                    <Image
                      width="125"
                      height="50"
                      src="/logo-180x180.png"
                      alt=""
                    />
                  </span>
                  <p className={styles["company-header"]}>
                    KlaudSol Philippines, Inc.
                  </p>
                  <p className={styles["company-address"]}>
                    <span className={styles["address-holder"]}>
                      Level 10-01 One Global Place 5th Avenue & 25th Street
                    </span>
                  </p>

                  <p className={styles["company-address"]}>
                    <span className={styles["address-holder"]}>
                      Bonifacio Global City, Taguig, Metro Manila Philippines
                    </span>
                  </p>

                  <div className={styles["container"]}>
                    <h1>CERTIFICATE OF INTERNSHIP COMPLETION</h1>

                    <p>This is to certify that</p>
                    <h2 className={styles["recipient"]}>
                      ANGELI MERCEDES S. TASO
                    </h2>

                    <p className={styles["para"]}>
                      Has completed her job duties and responsibilities during
                      her period of internship from{" "}
                      <b>March 16 to June 22, 2022</b>, after having rendered{" "}
                      <b>488.58 hours</b> with KlaudSol.
                    </p>

                    <p className={styles["para"]}>
                      During her course of internship with KlaudSol, she worked
                      on the KlaudSol SME project. She has put her best effort
                      into the project. Her performance was at par with our
                      expectations and she was able to complete the tasks
                      assigned to her in time.
                    </p>
                  </div>
                </div>
              </div>

              <br />
              <div className={styles["signatories"]}>
                <p>Signed</p>
                <br />
                <p className={styles["signatory-name"]}>ARDEE ARAM</p>
                <p className={styles["signatory-position"]}>
                  Managing Director
                </p>
                <p className={styles["signatory-company"]}>
                  KlaudSol Philippines, Inc.
                </p>
              </div>

              <div className={styles["uuid"]}>
                <p>certificate id: 601af4a5-3499-43d1-902b-ebf730d5c143</p>
              </div>
            </div>
            <br />
          </div>
          <div className={styles["btn-container"]}>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className={styles["submit-btn"]}
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </CacheContext.Provider>
  );
}
