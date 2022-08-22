import { useState, useEffect } from 'react'
import FrontPageLayout from '@/components/layouts/FrontPageLayout';
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from '@/lib/Session';

export default function Index() {


  return (
  <FrontPageLayout></FrontPageLayout>
  );
  
}


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
  
  let homepage;
  if(homepage = req.session?.cache?.homepage) {
    return {
       redirect: {
        permanent: false,
        destination: `/${homepage}`,
      }     
    }
  }

  // Pass data to the page via props
  return { props: {} }
  },
  sessionOptions
); 
  
