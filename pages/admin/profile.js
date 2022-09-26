import BasicLayout from "@/components/layouts/BasicLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@/lib/Session";

export default function Profile({cache}) {
  return (
    <CacheContext.Provider value={cache}>
      <BasicLayout>
        <div>
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-8">
              <h3 className="mt-5"> Profile </h3>
            </div>
           </div>
        </div>
      </BasicLayout>
    </CacheContext.Provider>
  );
}

export const getServerSideProps = getSessionCache();
