import { FaDownload, FaPlus, FaSave, FaEdit, FaTrash } from "react-icons/fa";
import DropDown from "@/components/timetracking/DropDown";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import styles from "@/styles/certificates/certificate-view/CertificateViewLayout.module.scss";
export default function SkeletonEditCertificate() {
  const availableCertificates = [
    { certificate_name: "", title: "" },
    { certificate_name: "", title: "" },
    { certificate_name: "", title: "" },
    { certificate_name: "", title: "" },
    { certificate_name: "", title: "" },
  ];
  return (
    <>
      <div className={styles["certificate-view-holder"]}>
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
                <CTableRow key ={i} >
                  <CTableDataCell key ={i}>
                    <p key ={i} className={styles["skeleton-text"]}>
                      {item.certificate_name}
                    </p>
                  </CTableDataCell>
                  <CTableDataCell key ={i+1}>
                    <p className={styles["skeleton-text"]}>{item.title}</p>
                  </CTableDataCell>
                  <button disabled={true} className="btn_edit">
                    <FaEdit />
                  </button>
                  <button disabled={true} className="btn_delete">
                    <FaTrash />
                  </button>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>
    </>
  );
}
