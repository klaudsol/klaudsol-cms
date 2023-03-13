import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

export default function Settings({ cache }) {
  
  return (
    <CacheContext.Provider value={cache}>
      <InnerSingleLayout>
        <div>
          <div className="row">
             <div style={{marginTop:'50px'}}>{`(Groups)`} In development</div>
          </div>
        </div>
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();