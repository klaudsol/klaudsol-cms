import { useState, useEffect } from "react";
import FrontPageLayout from "@/components/layouts/FrontPageLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/Session";
import { slsFetch } from "@/components/Util";
import { serverSideLogout } from "@/lib/Session";

export default function Index(props) {
  return <FrontPageLayout {...props}></FrontPageLayout>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {

    try {
      const response = await slsFetch(
        `${process.env.FRONTEND_URL}/api/settings/mainlogo`
      );
      var { data } = await response.json();
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
        props: { logo: data ?? {} },
      };
    }
  },
  sessionOptions
);
