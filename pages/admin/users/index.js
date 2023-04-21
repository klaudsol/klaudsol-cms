import { useEffect, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import UsersTable from "@/components/klaudsolcms/tables/UsersTable";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { useClientErrorHandler } from "@/components/hooks";

export default function ApprovedUsers({ cache }) {
    const [isLoading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const errorHandler = useClientErrorHandler();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const url = `/api/admin/users?approved=true`;
                const params = {
                    headers: {
                        Authorization: `Bearer ${cache.token}`,
                    }
                }
                const resRaw = await slsFetch(url, params);
                const { data } = await resRaw.json();

                setUsers(data);
            } catch (err) {
                errorHandler(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <CacheContext.Provider value={cache}>
            <InnerSingleLayout>
                <div className="mt-5 mb-3 d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <h3>Users</h3>
                        {isLoading && <AppButtonSpinner />}
                    </div>
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
