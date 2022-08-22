import { useState, useEffect } from "react";
import InnerLayout from "@/components/layouts/InnerLayout";
import App from "@/components/App";
import SMEIconContainer from "@/lib/sme/SMEIconContainer";
import SMEIcon from "@/lib/sme/SMEIcon";
import {
  FaTruck,
  FaClock,
  FaFile,
  FaMoneyBill,
  FaList,
  FaShoppingCart,
  FaUsers,
  FaGear,
  FaMoneyCheck,
  FaCertificate
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { getSessionCache } from "@/lib/Session";
import CacheContext from "@/components/contexts/CacheContext";

export default function Dashboard({ cache }) {
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout>
        <>
          {/*<SMEBreadcrumb paths={appBreadcrumbsArray()} />*/}

          <SMEIconContainer>

            {cache?.apps?.includes?.("trucking") && (
              <SMEIcon
                Icon={FaTruck}
                label="Trucking"
                bgColor="#324b4e"
                linkTo="/app/trucking"
              />
            )}

            {cache?.apps?.includes?.("timetracking") && (
              <SMEIcon
                Icon={FaClock}
                label="Timetracking"
                bgColor="#F76583"
                linkTo="/app/timetracking"
              />
            )}

            {cache?.apps?.includes?.("surveyforms") && (
              <SMEIcon
                Icon={FaFile}
                label="Surveyform"
                bgColor="#A155b9"
                linkTo="/app/surveyform/presidential_survey"
              />
            )}

            {cache?.apps?.includes?.("payroll") && (
              <SMEIcon
                Icon={FaMoneyBill}
                label="Payroll"
                className="bg-info"
                linkTo="/app/payroll"
              />
            )}

            {cache?.apps?.includes?.("inventory") && (
              <SMEIcon
                Icon={FaList}
                label="Inventory"
                className="bg-warning"
                linkTo="/app/inventory"
              />
            )}

            {cache?.apps?.includes?.("ecommerce") && (
              <SMEIcon
                Icon={FaShoppingCart}
                label="eCommerce"
                className="bg-success"
                linkTo="/app/ecommerece"
              />
            )}

            <SMEIcon
              Icon={FaUsers}
              label="Customers"
              bgColor="#BA0F30"
              linkTo="/app/customers"
            />

            {cache?.permissions?.includes?.("manage") && (
            <SMEIcon
              Icon={FaMoneyCheck}
              label="Taxes"
              bgColor="#483248"
              linkTo="/app/taxes"
            />)}

            <SMEIcon
              Icon={FaCertificate}
              label="Certificate Manager"
              bgColor="#FA8C05"
              linkTo="/app/certificate-manager"
            />

            {cache?.permissions?.includes?.('manage') && (
              <SMEIcon
                Icon={FiSettings}
                label="Settings"
                bgColor="#A8BBB0"
                linkTo="/app/settings"
              />
            )}
          </SMEIconContainer>
        </>
      </InnerLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
