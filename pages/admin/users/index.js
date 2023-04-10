import { useEffect, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import UsersTable from "@/components/klaudsolcms/tables/UsersTable";

export default function Type({ cache }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const url = `/api/admin/users?approved=true`;
      const params = {
        headers: {
            Authorization: `Bearer ${cache.token}`,
        }
      }
      const resRaw = await slsFetch(url, params);
      const { data } = await resRaw.json();

      console.log(data);
      setUsers(data);
    })();
  }, []);

  return (
    <CacheContext.Provider value={cache}>
      <InnerSingleLayout>
        <div className="mt-5 mb-3 d-flex justify-content-between">
          <h3>Users</h3>
          <AppCreatebutton
            link={`/admin/users/create`}
            title="Create new user"
          />
        </div>
        <UsersTable users={users} />
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
