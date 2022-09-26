import InnerLayout from "@/components/layouts/InnerLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";

export default function Settings({cache}) {
  return (
    <CacheContext.Provider value={cache}>
      <InnerLayout>
        <div>
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-8">
              <h3 className="mt-5"> Settings </h3>
            </div>
           </div>
        </div>
      </InnerLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
