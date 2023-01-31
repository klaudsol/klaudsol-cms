import React, { useReducer } from "react";
import Head from "next/head";
import RootContext from "@/components/contexts/RootContext";
import { rootReducer, rootInitialState } from "@/components/reducers/rootReducer";

import "@/styles/coreui/style.scss";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";
import "@/styles/klaudsolcms.scss";

import { useEffect } from "react";
import { useRouter } from "next/router";
import * as gtag from "@/lib/gtag";
import { Poppins } from '@next/font/google';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(rootReducer, rootInitialState);
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <React.StrictMode>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          KlaudSol CMS
        </title>
      </Head>
      <RootContext.Provider value={{ state, dispatch }}>
        <div className={poppins.className}>
         <Component {...pageProps} />
        </div>
      </RootContext.Provider>
    </React.StrictMode>
  );
}
