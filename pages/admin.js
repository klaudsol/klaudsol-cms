import { useState, useEffect } from "react";
import InnerLayout from "@/components/layouts/InnerLayout";
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


export default function Admin() {
  return (
      <InnerLayout>
        <>
        <div>
            <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
                    <h3 className="mt-5"> Welcome </h3>
                    <p> We hope you are making progess on your project! Feel free to read the latest news about Klaudsol-CMS. We are giving our best to improve the product based on your feedback. </p> 
                </div>
            </div>

            <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8 px-5 py-4 mt-5 general_container">
                   <p> Documentation</p>
                </div>

                <div className="col-xl-8 col-lg-8 col-md-8 px-5 py-4 mt-3 general_container">
                   <p> Code examples </p>
                </div>

                <div className="col-xl-8 col-lg-8 col-md-8 px-5 py-4 mt-3 general_container">
                   <p> Tutorials </p>
                </div>

                   <div className="col-xl-8 col-lg-8 col-md-8 px-5 py-4 mt-3 general_container">
                   <p> Blog </p>
                </div>
            </div>
        </div>
         
        </>
      </InnerLayout>
  );
}

