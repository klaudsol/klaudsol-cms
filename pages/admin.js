import BasicLayout from "@/components/layouts/BasicLayout";
import CacheContext from "@/components/contexts/CacheContext";
import RootContext from "@/components/contexts/RootContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

import { useState, useEffect, useContext } from "react";

/** react icons */
import { FaInfo, FaCode, FaPlay, FaFeather, FaGithub, FaDiscord, FaReddit, FaSlack } from "react-icons/fa";
import { FcVoicePresentation } from "react-icons/fc";

export default function Admin({cache}) {
  const { firstName = null, lastName = null } = cache ?? {};
  const { state } = useContext(RootContext);
  const cmsName = state.settings.cms_name

  return (
    <CacheContext.Provider value={cache}>
      <BasicLayout>
      <div>
          <div className="row px-0 mx-0">
            <div className="col-5 d-flex align-items-center d-flex align-items-center justify-content-center">
              <h3 className="text_welcome"> Hello, {firstName}.<br></br>Welcome to {cmsName}!</h3>
            </div>
            <div className="col-7">
              <div className='bg_svg'>
                <img src='/klaudsol-cms-vector-laptop.png' className="admin-vector-image"></img>
              </div>
              
            </div>
           </div>
        </div>
      </BasicLayout>
      </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
