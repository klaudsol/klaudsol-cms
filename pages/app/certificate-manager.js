import InnerLayout from "@/components/layouts/InnerLayout";
import SMEIconContainer from "@/lib/sme/SMEIconContainer";
import SMEIcon from "@/lib/sme/SMEIcon";

import { FaTools, FaEye } from "react-icons/fa";

import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";

export default function CertificateManager({ cache }) {
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout>
        <SMEIconContainer>
          <SMEIcon
            Icon={FaEye}
            label="View Certificates"
            linkTo="/app/certificate-manager/certificate-view"
            bgColor="#2094B9"
          />

          <SMEIcon
            Icon={FaTools}
            label="Template Generator"
            linkTo="/app/certificate-manager/certificate-template"
            bgColor="#59981A"
          />
        </SMEIconContainer>
      </InnerLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
