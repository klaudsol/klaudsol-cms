import { useState, useEffect } from "react";
import FrontPageLayout from "@/components/layouts/FrontPageLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/Session";
import { slsFetch } from "@/components/Util";
import { serverSideLogout } from "@/lib/Session";
import Setting from "@/backend/models/core/Setting";
import { mainlogo } from "@/constants/index";

export default function Index(props) {
  return <FrontPageLayout {...props}></FrontPageLayout>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {

    try {
      var rawData = await Setting.get({ slug: mainlogo });    
      var data = { ...rawData[0], link:`${process.env.KS_S3_BASE_URL}/${rawData[0].value}` };
  // To ensure maximum efficiency and avoid any unnecessary involvement with the assertUserCan() function, 
  // it is recommended to directly fetch our logo from the core setting. 
    } catch (err) {}

  try{
    if(req.session?.cache?.forcePasswordChange){     
      await serverSideLogout(req)
    }
  } catch(err){}

    let homepage = req.session?.cache?.homepage;
    if ((homepage && !req.session?.cache?.forcePasswordChange)) {
      return {
        redirect: {
          permanent: false,
          destination: `/${homepage}`,
        },
      };
    } 
    else {
      return {
        props: { logo: rawData?.length ? data : {} },
      };
    }
  },
  sessionOptions
);
