import { useState, useEffect } from 'react'
import InnerLayout from '@/components/layouts/InnerLayout';
import SMEIconContainer from '@/lib/sme/SMEIconContainer';
import SMEIcon from '@/lib/sme/SMEIcon';
import { appPath } from '@/apps/AppRegistry';
import Trucking from '@/apps/trucking/Trucking';
import { BiSpreadsheet, BiLocationPlus } from 'react-icons/bi';
import { BsCashCoin, BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { GrLocation } from 'react-icons/gr';
import CacheContext from '@/components/contexts/CacheContext';
import { getSessionCache } from '@/lib/Session';

export default function TruckingPage({cache}) {
    
    return (
      <CacheContext.Provider value={cache}>
        <InnerLayout>  
            <SMEIconContainer>
            
                <SMEIcon Icon={BiSpreadsheet}  label="Trip Ticket" 
                  linkTo="/app/trucking/trip-tickets" bgColor="#2094B9" />
                  
                <SMEIcon Icon={BsCashCoin}  label="Collection" 
                  linkTo="/app/trucking/collection" bgColor="#59981A" />
                  
                <SMEIcon Icon={BsFileEarmarkSpreadsheet}  label="Reports" 
                  linkTo="/app/trucking/reports" bgColor="#555955" />
                  
                <SMEIcon Icon={BiLocationPlus}  label="Locations" 
                  linkTo="/app/trucking/locations" bgColor="#A62424" />
                
            
                
            </SMEIconContainer>        
        </InnerLayout>
      </CacheContext.Provider>
    );
    
}

export const getServerSideProps = getSessionCache();