import InnerLayout from "@/components/layouts/InnerLayout";

/** kladusol CMS components */
import AppDropdown from '@/components/klaudsolcms/AppDropdown'
import AppTable from '@/components/klaudsolcms/AppTable'
import AppCreatebutton from '@/components/klaudsolcms/buttons/AppCreateButton'
import AppFilterButton from '@/components/klaudsolcms/buttons/AppFilterButton'
import AppBackButton from '@/components/klaudsolcms/buttons/AppBackButton'
import AppIconButton from '@/components/klaudsolcms/buttons/AppIconButton'

/** react-icons */
import { FaChevronLeft, FaSearch, FaChevronRight } from "react-icons/fa";

import { BsGearFill } from 'react-icons/bs'

export default function ContentManager() {
  /** Data Arrays : to be fetched from database soon */
  const items = [
    {name: 'Id'}, 
    {name: 'Name'},
    {name: 'Price'},
    {name: 'Image1'}
  ];

  const entryNumber = [
    {name: '10'}, 
    {name: '20'},
    {name: '50'},
    {name: '100'},
  ]

  const columns = [
    { accessor: "checkbox", displayName: <input type="checkbox" />, },
    { accessor: "id", displayName: "ID",  },
    { accessor: "name", displayName: "NAME", },
    { accessor: "price", displayName: "PRICE", },
    { accessor: "image_1", displayName: "IMAGE1",  },
    { accessor: "", displayName: "", },
  ];

  const entries = [
      {checkbox: <input type="checkbox" />, id: 1, name: 'Porschetta', price: 4000, image_1: null },
      {checkbox: <input type="checkbox" />, id: 2, name: 'Brownies', price: 500, image_1: null }
  ]

  return (
      <InnerLayout title="Content">
        <AppBackButton />
        <div className="d-flex justify-content-between align-items-center mt-0 mx-0 px-0">
          <div>
          <h3> TYPE </h3>
          <p> {entries.length} entries found </p>
          </div>
          <AppCreatebutton title='Create new entry' />
        </div>

        <div className="d-flex justify-content-between align-items-center px-0 mx-0 pb-3"> 
            <div className="d-flex flex-row px-0">
              <AppIconButton icon={<FaSearch/>} /> 
              <AppFilterButton />
            </div>

            <div className="d-flex flex-row px-0"> 
              <AppDropdown title={ items.length + ' items selected'} items={items} id='dropdown_general' isCheckbox={true}/>
              <AppIconButton icon={<BsGearFill/>} /> 
            </div>
        </div>

        <AppTable columns={columns} entries={entries} />
     
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-row">
            <AppDropdown title='10' items={entryNumber} id='dropdown_entries' isCheckbox={false}/>
            <p className="mt-2"> Entries per page </p> 
          </div>
        
          <div className="d-flex flex-row">
            <button className="btn_arrows"> <FaChevronLeft className="mb-2 mr-1" style={{fontSize: "10px"}}/> </button>
            <p className="page_number"> 1 </p> 
            <button className="btn_arrows"> <FaChevronRight className="mb-2 ml-1" style={{fontSize: "10px"}}/> </button>
          </div>
        </div>
         
      </InnerLayout>
  );
}

