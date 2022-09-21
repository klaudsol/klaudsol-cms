import { useState, useEffect } from "react";
import BasicLayout from "@/components/layouts/BasicLayout";
import {
  FaHandPeace, FaInfo, FaCode, FaPlay, FaFeather, FaGithub, FaDiscord, FaReddit, FaSlack
} from "react-icons/fa";

import { FcVoicePresentation } from "react-icons/fc";



export default function Admin() {
  return (
      <BasicLayout>
        <>
        <div>
            <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
                    <h3 className="mt-5 mb-3"> Welcome <FcVoicePresentation className="welcome_icon" /></h3>
                    <p> We hope you are making progess on your project! Feel free to read the latest news about Klaudsol-CMS. We are giving our best to improve the product based on your feedback. </p> 
                </div>
            </div>

            <div class="row gx-4">
              <div class="col-8">
              <div class="general_container px-5 pt-3 pb-4 mt-3"> 
                  <div className="d-flex align-items-center justify-content-start">
                      <div className='dashboard_icon_container'> <FaInfo className='dashboard_icon'/> </div>
                    <div>
                      <p className="mx-0 px-0 mt-2"> <b style={{fontSize: '16px'}}> Documentation </b>  <br></br>
                        Discover the essential concepts, guides, and instructions.</p>
                    </div>
                    </div>
                </div>

                <div class="general_container  px-5 pt-3 pb-4 mt-3"> 
                <div className="d-flex align-items-center justify-content-start">
                    <div className='dashboard_icon_container'> <FaCode className='dashboard_icon'/> </div>
                  <div>
                    <p className="mx-0 px-0 mt-2"> <b style={{fontSize: '16px'}}> Code Examples </b>  <br></br>
                      Learn by testing real projects developed by the community.</p>
                  </div>
                  </div>
                </div>

                <div class="general_container  px-5 pt-3 pb-4 mt-3"> 
                <div className="d-flex align-items-center justify-content-start">
                    <div className='dashboard_icon_container'> <FaPlay className='dashboard_icon'/> </div>
                  <div>
                    <p className="mx-0 px-0 mt-2"> <b style={{fontSize: '16px'}}> Tutorials </b>  <br></br>
                      Follow step-by-step instructions to use and customize KlaudSol CMS.</p>
                  </div>
                  </div>
                </div>

                <div class="general_container  px-5 pt-3 pb-4 mt-3"> 
                  <div className="d-flex align-items-center justify-content-start">
                    <div className='dashboard_icon_container'> <FaFeather className='dashboard_icon'/> </div>
                  <div>
                    <p className="mx-0 px-0 mt-2"> <b style={{fontSize: '16px'}}> Blog </b>  <br></br>
                      Read the latest news about KlaudSol CMS and the ecosystem.</p>
                  </div>
                  </div>
                </div>
              
              
              </div>


              <div class="col-4">
                <div class="px-3 pt-3 pb-5 general_container mt-3"> 
                <h6> <b> Join the community  </b> </h6>
                <p> Discuss with team members, contributors and developers on different channels. </p>
                
                <div className="row">
                <div className="col-6 mx-0">
                  <a href="https://github.com/klaudsol/klaudsol-cms" target="_blank"> <button className="community_button"> <FaGithub className="community_icon"/> Github </button> </a>
                  <a href="https://reddit.com" target="_blank"> <button className="community_button"> <FaReddit className="community_icon"/> Reddit </button> </a>
                </div>

                <div className="col-6">
                <a href="https://discord.gg/kdHTwueF" target="_blank"> <button className="community_button"> <FaDiscord className="community_icon"/> Discord </button> </a>
                <a href="https://slack.com" target="_blank"> <button className="community_button"> <FaSlack className="community_icon"/> Slack </button> </a>
                </div>
                </div>
               
                </div>
              </div>

            </div>
        </div>
         
        </>
      </BasicLayout>
  );
}

