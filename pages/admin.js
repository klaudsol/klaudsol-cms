import BasicLayout from "@/components/layouts/BasicLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";

import { useState, useEffect, useContext } from "react";

/** react icons */
import { FaInfo, FaCode, FaPlay, FaFeather, FaGithub, FaDiscord, FaReddit, FaSlack } from "react-icons/fa";
import { FcVoicePresentation } from "react-icons/fc";

export default function Admin({cache}) {
  const { firstName = null, lastName = null } = cache ?? {};
  return (
    <CacheContext.Provider value={cache}>
      <BasicLayout>
      <div>
          <div className="row px-0 mx-0">
            <div className="col-4 d-flex align-items-center">
              <h3 className="text_welcome"> Hello, {firstName}.<br></br>Welcome to KlaudSol CMS!</h3>
            </div>
            <div className="col-8">
              <div className='bg_svg' />
            </div>
           </div>
        </div>
      </BasicLayout>
      </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();