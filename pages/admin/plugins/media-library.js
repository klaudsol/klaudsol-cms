import { useState, useEffect } from "react";
import BasicLayout from "@/components/layouts/BasicLayout";

/** kladusol cms components */
import AppDropdown from '@/components/klaudsolcms/AppDropdown'
import AppTable from '@/components/klaudsolcms/AppTable'
import AppCreatebutton from '@/components/klaudsolcms/buttons/AppCreateButton'
import AppButtonLg from '@/components/klaudsolcms/buttons/AppButtonLg'
import AppButtonSm from '@/components/klaudsolcms/buttons/AppButtonSm'
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppContentBuilderButtons from '@/components/klaudsolcms/buttons/AppContentBuilderButtons'
import AppIconButton from '@/components/klaudsolcms/buttons/AppIconButton'

/** react-icons */
import { FaPlus, FaSearch } from 'react-icons/fa'
import { IoFilter } from 'react-icons/io5'
import { ImFilesEmpty } from 'react-icons/im'

export default function ContentManager() {
  const sortItems = [
    {name: 'Most recent uploads'}, 
    {name: 'Oldest uploads'},
    {name: 'Alphabetical order (A to Z)'},
    {name: 'Reverse alphabetical order (Z to A)'},
    {name: 'Most recent updates'},
    {name: 'Oldest updates'},
  ]
  return (
      <BasicLayout>
        <div className="row">
          <div className="d-flex align-items-center justify-content-between pt-4 px-4 mb-4">
            <h2> Media Library </h2>  
            <div className="d-flex flex-row px-0 py-0 mx-0 my-0">
              <AppButtonLg title='Add new folder' icon={<FaPlus />} isDisabled={false}/>
              <div className="px-1"></div>
              <AppCreatebutton title='Add new assets' />
            </div>
          </div>

         <div className="d-flex align-items-start justify-content-between px-4">
          <div className="d-flex flex-row px-0 mx-0 my-0 py-0">
              <AppDropdown title='Sort by' items={sortItems} id='dropdown_general' isCheckbox={false}/>
              <AppButtonSm title='Filters' icon={<IoFilter />} isDisabled={false}/>
            </div>
            <AppIconButton icon={<FaSearch/>} /> 
         </div>

        <div className="container mt-3">
          <div className="row mt-3">
            <div className="col">
              <div className="p-1 container_assets_bg "></div>
            </div>
            <div className="col">
              <div className="p-1 container_assets_bg"></div>
            </div>  
            <div className="col ">
              <div className="p-1 container_assets_bg">
              <div className="d-flex align-items-center justify-content-center flex-column mt-4">
                <ImFilesEmpty className="icon_assets" />
              <h6> Upload your first assets</h6>
              <AppCreatebutton title='Add new assets' />
             </div>
              </div>
            </div>
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <div className="p-1 container_assets_bg "></div>
            </div>
            <div className="col">
              <div className="p-1 container_assets_bg"></div>
            </div>  
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <div className="p-1 container_assets_bg "></div>
            </div>
            <div className="col">
              <div className="p-1 container_assets_bg"></div>
            </div>  
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
            <div className="col ">
              <div className="p-1 container_assets_bg"></div>
            </div>
          </div>
        </div>

       

        </div>
      </BasicLayout>
  );
}

