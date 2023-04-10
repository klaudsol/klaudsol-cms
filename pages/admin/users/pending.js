import { useEffect, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import PendingUsersTable from "@/components/klaudsolcms/tables/PendingUsersTable";

export default function PendingUsers({ cache }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const url = `/api/admin/users?pending=true`;
      const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cache.token}`
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
          <h3>Pending users</h3>
          <AppCreatebutton
            link={`/admin/users/create`}
            title="Create new user"
          />
        </div>
        <PendingUsersTable users={users} token={cache.token} />
      </InnerSingleLayout>
    </CacheContext.Provider>
  );
}
export const getServerSideProps = getSessionCache();
