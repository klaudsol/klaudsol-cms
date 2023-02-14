import { useState, useEffect } from "react";
import FrontPageLayout from "@/components/layouts/FrontPageLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/Session";
import { slsFetch } from '@/components/Util'; 

export default function Index(props) {
  return <FrontPageLayout {...props} ></FrontPageLayout>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
   try{
    const response = await slsFetch(`http://localhost:3001/api/resources/mainlogo`);
    const { data } = await response.json()   

    // Pass data to the page via props
    return { props: { logo: data ?? {} } };
   }catch(err){
    return { props: {} }
   }
   finally {
    let homepage;
    if ((homepage = req.session?.cache?.homepage)) {
      return {
        redirect: {
          permanent: false,
          destination: `/${homepage}`,
        },
      };
    }
   }
  },
  sessionOptions
);
