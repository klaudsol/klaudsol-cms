import InnerLayout from '@/components/layouts/InnerLayout';
import SMEIconContainer from '@/lib/sme/SMEIconContainer';
import { getSessionCache } from "@/lib/Session";
export default function LocationPage({ cache }) {
    
    return (
        <InnerLayout>  
            <SMEIconContainer>
            
            
                
            </SMEIconContainer>        
        </InnerLayout>
    );
    
}

export const getServerSideProps = getSessionCache();