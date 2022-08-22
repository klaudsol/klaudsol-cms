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
export default function TripTicketPage({ cache }) {
    
    return (
        <InnerLayout>
            <SMEIconContainer>
                        
                            
            </SMEIconContainer> 
        </InnerLayout>
        
                   
    );
    
}

export const getServerSideProps = getSessionCache();