import { useState, useEffect } from "react";
import FrontPageLayout from "@/components/layouts/FrontPageLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@klaudsol/commons/lib/Session";
import { slsFetch } from "@/components/Util";
import { serverSideLogout } from "@klaudsol/commons/lib/Session";
import Setting from "@/backend/models/core/Setting";
import { mainlogo } from "@/constants/index";

export default function Index(props) {
  return <FrontPageLayout {...props}></FrontPageLayout>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    try {
      const rawData = await Setting.getLogo();
      const data = rawData[0];

      if (req.session?.cache?.forcePasswordChange) {
        await serverSideLogout(req);
      }

      const homepage = req.session?.cache?.homepage;
      if (homepage && !req.session?.cache?.forcePasswordChange) {
        return {
          redirect: {
            permanent: false,
            destination: `/${homepage}`,
          },
        };
      } else {
        const logoLink = `${process.env.KS_S3_BASE_URL}/${data.value}`;

        return {
          props: {
            logo: data.value !== "default" ? logoLink : "/logo-180x180.png",
          },
        };
      }
    } catch (err) {
      console.error(err);

      return { props: {} };
    }
  },
  sessionOptions
);
